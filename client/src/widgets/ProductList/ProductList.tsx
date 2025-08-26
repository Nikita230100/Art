import { useRef, useState, useEffect } from "react";

import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import type { IArt } from "@/entities/art/model/types";
import { getArtsBySellerIdThunk, deleteArtThunk } from "@/entities/art/api/artThunkApi";
import { Modal } from "@/shared/ui/Modal/Modal";
import styles from "./ProductList.module.css";
import {Alert} from 'react-bootstrap'
export default function ProductList(): React.JSX.Element {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { arts } = useAppSelector(state => state.art);
    const { seller } = useAppSelector(state => state.seller);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [artToDelete, setArtToDelete] = useState<number | null>(null);
    const alertStyle: React.CSSProperties = {
        position: 'fixed',   
        top: '20px',            
        left: '50%',           
        transform: 'translateX(-50%)', 
        zIndex: 1000,          
        width: '80%',          
        maxWidth: '500px',      
        textAlign: 'center', 
        color: 'white',
        backgroundColor: 'grey',  
      };
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    useEffect(() => {
        const fetchArts = async (): Promise<void> => {
            try {
                setIsLoading(true);
                if (seller?.id) {
                    await dispatch(getArtsBySellerIdThunk(Number(seller.id))).unwrap();
                }
            } catch (err) {
                console.error('Failed to fetch arts:', err);
                setError('Failed to fetch arts');
                setTimeout(() => {
                    setError('');
                }, 3000);
            } finally {
                setIsLoading(false);
            }
        };
        fetchArts();
    }, [dispatch, seller?.id]);

    const handleDelete = async (id: number): Promise<void> => {
        try {
            const response = await dispatch(deleteArtThunk(id)).unwrap();
            setIsDeleteModalOpen(false);
            setArtToDelete(null);
        
            if (response.statusCode === 200) {
                setSuccess("Товар успешно удален");
                setTimeout(() => {
                    setSuccess('');
                }, 3000);
            } else {
                setError("Произошла ошибка при удалении товара");
                setTimeout(() => {
                    setError('');
                }, 3000);
            }
        } catch (error) {
            console.error('Failed to delete art:', error);
            setError("Произошла ошибка при удалении товара");
            setTimeout(() => {
                setError('');
            }, 3000);
        }
    };

    const handleScroll = (): void => {
        if (scrollContainerRef.current) {
            setShowLeftButton(scrollContainerRef.current.scrollLeft > 0);
        }
    };
    
    const scrollLeft = (): void => {
        if (scrollContainerRef.current) {
            const cardWidth = 280;
            scrollContainerRef.current.scrollBy({ left: -cardWidth * 3, behavior: 'smooth' });
        }
    };
    
    const scrollRight = (): void => {
        if (scrollContainerRef.current) {
            const cardWidth = 280;
            scrollContainerRef.current.scrollBy({ left: cardWidth * 3, behavior: 'smooth' });
        }
    };

    if (isLoading) return <div className={styles.loading}>Загрузка товаров...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.productListContainer}>
            {error && <Alert variant="danger" style={alertStyle}>{error}</Alert>}
            {success && <Alert variant="light" style={alertStyle}>{success}</Alert>}
            <div className={styles.productsHeader}>
                <h2>Мои товары</h2>
                <button 
                    className={styles.addProductBtn}
                    onClick={() => navigate('/seller/product-form')}
                >
                    + Добавить товар
                </button>
            </div>
            
            <div className={styles.productsScrollArea}>
                {showLeftButton && (
                    <button 
                        className={`${styles.scrollButton} ${styles.left}`}
                        onClick={scrollLeft} 
                        aria-label="Показать предыдущие товары"
                    >
                        &lt;
                    </button>
                )}
                
                <div 
                    className={styles.productsScrollContainer}
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                >
                    {arts.length === 0 ? (
                        <div className={styles.noProducts}>У вас пока нет товаров</div>
                    ) : (
                        arts.map((art: IArt) => (
                            <div key={art.id} className={styles.productCard}>
                                <div className={styles.productImageContainer}>
                                    <img src={art.img} alt={art.name} className={styles.productImage}/>
                                </div>
                                <h3 className={styles.productTitle}>{art.name}</h3>
                                <p className={styles.productPrice}>{art.price} ₽</p>
                                <div className={styles.productActions}>
                                    <button 
                                        className={styles.editBtn}
                                        onClick={() => navigate(`/seller/product-form/${art.id}`)}
                                    >
                                        Редактировать
                                    </button>
                                    <button 
                                        className={styles.deleteBtn}
                                        onClick={() => {
                                            setArtToDelete(art.id);
                                            setIsDeleteModalOpen(true);
                                        }}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                
                {arts.length > 3 && (
                    <button 
                        className={`${styles.scrollButton} ${styles.right}`}
                        onClick={scrollRight} 
                        aria-label="Показать следующие товары"
                    >
                        &gt;
                    </button>
                )}
            </div>

            {/* Модальное окно удаления */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setArtToDelete(null);
                }}
                onConfirm={() => artToDelete && handleDelete(artToDelete)}
                title="Удалить товар"
                content="Вы уверены, что хотите удалить этот товар?"
                confirmText="Удалить"
                cancelText="Отменить"
            />
        </div>
    );
}