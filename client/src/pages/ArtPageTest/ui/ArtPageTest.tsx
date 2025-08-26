import { useEffect, useLayoutEffect, useState } from 'react';
import { ArtListTest } from '@/entities/art/ui/ArtListTest';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { getArtsThunk } from '@/entities/art/api/artThunkApi';
import styles from './style.module.css';

export function ArtPageTest(): React.JSX.Element {
  const dispatch = useAppDispatch();

  const [color, setColor] = useState<string>('#000000');

  const generateColor = (): void => {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    setColor(randomColor);
  };

  useLayoutEffect(() => {
    document.title = 'Art Market: Art Page';
  }, []);

  useEffect(() => {
    dispatch(getArtsThunk());
  }, [dispatch]);

  return (
    <div className="container">
      <h1 className={`${styles.header} mt-3`} onClick={generateColor} style={{ color }}>
        Art Page
      </h1>
      <ArtListTest />
    </div>
  );
}
