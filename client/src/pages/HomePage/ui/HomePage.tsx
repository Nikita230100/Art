import React, { useEffect, useState } from 'react';
import { ProductCard } from '@/widgets/ProductCard/ProductCard';
import {
  getAllColorsThunk,
  getArtsThunk,
  searchArtsByColorsThunk,
} from '@/entities/art/api/artThunkApi';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import styles from './HomePage.module.css';
import AIChat from '@/features/ai/ui/AiChat/AiChat';

interface FilterState {
  priceRange: {
    min: number;
    max: number;
  };
  size: {
    width: { min: number; max: number };
    height: { min: number; max: number };
  };
  material: string;
}

export interface Product {
  id: number;
  title: string;
  type: 'Картина' | 'Фото' | 'Статуэтка';
  image: string;
  width: number;
  height: number;
  style: string;
  material: string;
  quantity: number;
  price: number;
}

export function HomePage(): React.JSX.Element {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: { min: 0, max: 10000000 },
    size: {
      width: { min: 0, max: 1000 },
      height: { min: 0, max: 1000 },
    },
    material: 'all',
  });

  const dispatch = useAppDispatch();
  const { arts, colors } = useAppSelector((state) => state.art);

  useEffect(() => {
    dispatch(getAllColorsThunk());
    dispatch(getArtsThunk());
  }, [dispatch]);

  const handleSearch = async (): Promise<void> => {
    if (selectedColors.length > 0) {
      await dispatch(searchArtsByColorsThunk(selectedColors));
    } else {
      await dispatch(getArtsThunk());
    }
  };

  const handleColorSelect = (color: string): void => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter((c) => c !== color));
    } else if (selectedColors.length < 3) {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handleResetFilter = async (): Promise<void> => {
    setSelectedColors([]);
    await dispatch(getArtsThunk());
  };

  const handleFilterChange = (
    filterType: keyof FilterState,
    value: FilterState[keyof FilterState],
  ): void => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const filteredArts = arts.filter((art) => {
    const priceInRange = art.price >= filters.priceRange.min && art.price <= filters.priceRange.max;
    const widthInRange = art.width >= filters.size.width.min && art.width <= filters.size.width.max;
    const heightInRange =
      art.height >= filters.size.height.min && art.height <= filters.size.height.max;
    const materialMatch = filters.material === 'all' || art.material === filters.material;

    return priceInRange && widthInRange && heightInRange && materialMatch;
  });

  const materials = [...new Set(arts.map((art) => art.material))];

  return (
    <div className={styles.container}>
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Идеальная картина для вашего проекта — за 3 минуты</h1>
          <p className={styles.heroSubtitle}>
            Более 5000 оригинальных работ от 300+ художников для вашего интерьера. Воспользуйтесь
            поиском по цвету, или просмотрите все работы целиком.
          </p>
        </div>
      </section>

      <div className={styles.filterCard}>
        <div className={styles.filterHeader}>
          <div>
            <h2 className={styles.filterTitle}>Фильтры</h2>
            <p className={styles.filterDescription}>Настройте параметры поиска картин</p>
          </div>
          <div className={styles.filterButtons}>
            <button className={styles.searchButton} onClick={handleSearch}>
              Найти подходящие работы
            </button>
            <button className={styles.resetButton} onClick={handleResetFilter}>
              Сбросить фильтры
            </button>
          </div>
        </div>

        <div className={styles.filtersContainer}>
          {/* Цветовой фильтр */}
          <div className={styles.filterSection}>
            <h3 className={styles.filterSectionTitle}>
              Цветовая гамма{' '}
              <span className={styles.colorCounter}>{selectedColors.length}/3 цветов</span>
            </h3>
            <p className={styles.filterDescription}>Выберите до 3 цветов для поиска</p>
            <div className={styles.colorGrid}>
              {colors.map((color) => (
                <div
                  key={color.id}
                  className={`${styles.colorRectangle} ${
                    selectedColors.includes(color.hex) ? styles.selected : ''
                  } ${
                    selectedColors.length >= 3 && !selectedColors.includes(color.hex)
                      ? styles.disabled
                      : ''
                  }`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => handleColorSelect(color.hex)}
                  title={`${color.name} (${color.hex})`}>
                  {selectedColors.includes(color.hex) && (
                    <span className={styles.checkIcon}>✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Ценовой фильтр */}
          <div className={styles.filterSection}>
            <h3 className={styles.filterSectionTitle}>Цена</h3>
            <div className={styles.rangeInputs}>
              <div className={styles.inputGroup}>
                <label className={styles.rangeLabel}>от</label>
                <input
                  type="number"
                  value={filters.priceRange.min}
                  onChange={(e) =>
                    handleFilterChange('priceRange', {
                      ...filters.priceRange,
                      min: Number(e.target.value),
                    })
                  }
                  className={styles.rangeInput}
                />
              </div>
              <span>—</span>
              <div className={styles.inputGroup}>
                <label className={styles.rangeLabel}>до</label>
                <input
                  type="number"
                  value={filters.priceRange.max}
                  onChange={(e) =>
                    handleFilterChange('priceRange', {
                      ...filters.priceRange,
                      max: Number(e.target.value),
                    })
                  }
                  className={styles.rangeInput}
                />
              </div>
              <span className={styles.currency}>₽</span>
            </div>
          </div>

          {/* Фильтр размеров */}
          <div className={styles.filterSection}>
            <h3 className={styles.filterSectionTitle}>Размеры</h3>
            <div className={styles.sizeInputs}>
              <div className={styles.dimensionGroup}>
                <label>Ширина (см):</label>
                <div className={styles.rangeInputs}>
                  <div className={styles.inputGroup}>
                    <label className={styles.rangeLabel}>от</label>
                    <input
                      type="number"
                      value={filters.size.width.min}
                      onChange={(e) =>
                        handleFilterChange('size', {
                          ...filters.size,
                          width: {
                            ...filters.size.width,
                            min: Number(e.target.value),
                          },
                        })
                      }
                      className={styles.rangeInput}
                    />
                  </div>
                  <span>—</span>
                  <div className={styles.inputGroup}>
                    <label className={styles.rangeLabel}>до</label>
                    <input
                      type="number"
                      value={filters.size.width.max}
                      onChange={(e) =>
                        handleFilterChange('size', {
                          ...filters.size,
                          width: {
                            ...filters.size.width,
                            max: Number(e.target.value),
                          },
                        })
                      }
                      className={styles.rangeInput}
                    />
                  </div>
                  <span className={styles.unit}>см</span>
                </div>
              </div>
              <div className={styles.dimensionGroup}>
                <label>Высота:</label>
                <div className={styles.rangeInputs}>
                  <div className={styles.inputGroup}>
                    <label className={styles.rangeLabel}>от</label>
                    <input
                      type="number"
                      value={filters.size.height.min}
                      onChange={(e) =>
                        handleFilterChange('size', {
                          ...filters.size,
                          height: {
                            ...filters.size.height,
                            min: Number(e.target.value),
                          },
                        })
                      }
                      className={styles.rangeInput}
                    />
                  </div>
                  <span>—</span>
                  <div className={styles.inputGroup}>
                    <label className={styles.rangeLabel}>до</label>
                    <input
                      type="number"
                      value={filters.size.height.max}
                      onChange={(e) =>
                        handleFilterChange('size', {
                          ...filters.size,
                          height: {
                            ...filters.size.height,
                            max: Number(e.target.value),
                          },
                        })
                      }
                      className={styles.rangeInput}
                    />
                  </div>
                  <span className={styles.unit}>см</span>
                </div>
              </div>
            </div>
          </div>

          {/* Фильтр материалов */}
          <div className={styles.filterSection}>
            <h3 className={styles.filterSectionTitle}>Материал</h3>
            <select
              value={filters.material}
              onChange={(e) => handleFilterChange('material', e.target.value)}
              className={styles.materialSelect}>
              <option value="all">Все материалы</option>
              {materials.map((material) => (
                <option key={material} value={material}>
                  {material}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className={styles.aiSection}>
        <button className={styles.aiTriggerButton} onClick={() => setIsChatVisible(!isChatVisible)}>
          ?
        </button>

        {isChatVisible && (
          <div className={`${styles.aiChatPopup} ${isChatVisible ? styles.visible : ''}`}>
            <div className={styles.chatHeader} onClick={() => setIsChatVisible(false)}>
              <h3>ИИ-ассистент</h3>
              <button className={styles.closeButton}>×</button>
            </div>
            <div className={styles.chatBody}>
              <AIChat />
            </div>
          </div>
        )}
      </div>

      <div className={styles.artsContainer}>
        <div className={styles.artsGrid}>
          {filteredArts.map((art) => (
            <ProductCard key={art.id} art={art} />
          ))}
        </div>
      </div>
    </div>
  );
}
