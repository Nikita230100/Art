import { CurrentArt } from "@/widgets/CurrentArt";
import { useParams } from "react-router";
import styles from "./OneArtPage.module.css";

export default function OneArtPage(): React.JSX.Element {
   
const {id} = useParams();
   if (!id) {
    return <div> Продукт не найден</div>
   }
  return (
    <div className={styles.container}>
      <CurrentArt id={id} />
    </div>
  )
}
