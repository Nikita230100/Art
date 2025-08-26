import { getArtByIdThunk } from "@/entities/art/api/artThunkApi";
import { useAppDispatch } from "@/shared/hooks/useAppDispatch";
import { useAppSelector } from "@/shared/hooks/useAppSelector"
import { useEffect } from "react";
import { useNavigate } from "react-router";
import styles from "./CurrentArt.module.css";
import { getMainColorsThunk } from "@/entities/mainColor/api/mainColorThunkApi";
export function CurrentArt({ id }: { id: string }): React.JSX.Element {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {  art, isLoading, error } = useAppSelector(state => state.art);
    const { mainColors} = useAppSelector(state => state.mainColor);
    
    useEffect(() => {
        dispatch(getArtByIdThunk(Number(id)));
        dispatch(getMainColorsThunk(Number(id)));
    }, [dispatch, id]);

    if (isLoading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;
    if (!art) return <div>Продукт не найден</div>;


    const renderArtDetail = (label: string, value?: string | number): React.JSX.Element | null => {
        if (!value) return null;
        return (
            <p>
                <strong>{label}:</strong> {value}
            </p>
        );
    };


   

    
    return (
        <>
       
        <div className={styles.artPageContainer}>
            <div className={styles.artPage}>
                <div className={styles.artPageLeft}>
                    <img 
                        src={art.img || '/placeholder-art.jpg'} 
                        alt={art.name} 
                        className="art-image"
                    />
                </div>
                <div className={styles.artPageRight}>
                    <h1 className={styles.artTitle}>{art.name}</h1>
                    {art.description && (
                        <div className={styles.artDescription}>
                            <h3>Описание:</h3>
                            <p>{art.description}</p>
                        </div>
                    )}

                    <div className={styles.artDetails}>
                        {renderArtDetail("Цена", art.price)}
                        {renderArtDetail("Количество", art.quantity)}
                        {renderArtDetail("Ширина", art.width)}
                        {renderArtDetail("Высота", art.height)}
                        {renderArtDetail("Глубина", art.depth)}
                        {art.material && renderArtDetail("Материал", art.material)}
                        {art.style && renderArtDetail("Стиль", art.style)}
                    </div>
                </div>
            </div>
           {/* Палитра цветов */}
{mainColors.length > 0 && (
                        <div className={styles.colorPalette}>
                            <h3>Цветовая гамма:</h3>
                            <div className={styles.colorContainer}>
                                {mainColors.map((mainColor) => (
                                    <div 
                                        key={`${mainColor.artId}-${mainColor.colorId}`}
                                        className={styles.colorSwatch}
                                        style={{ backgroundColor: mainColor.Color.hex }}
                                        title={`${mainColor.Color.name} (${mainColor.Color.hex})`}
                                    >
                                        <span className={styles.colorTooltip}>
                                            {mainColor.Color.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
            <div className={styles.backButton}>
                <button 
                    onClick={() => navigate(-1)}
                    className="button secondary"
                >
                    Назад
                </button>
            </div>
        </div>
        </>
    );
}