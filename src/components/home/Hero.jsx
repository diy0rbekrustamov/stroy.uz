import { useLanguage } from "../../i18n/useLanguage.js";
import Button from "../ui/Button.jsx";
import hero from "../../assets/optimized/hero-clean.webp";
import Icon from "./Icon.jsx";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <>
      <section className="home-hero" aria-labelledby="hero-title">
        <div className="home-hero-copy">
          <p className="home-eyebrow">{t("МАТЕРИАЛЫ ДЛЯ БОЛЬШИХ ИДЕЙ")}</p>
          <h1 id="hero-title">
            {t("ОТ ОСНОВЫ.")}
            <br />
            {t("ДО ВЕРШИНЫ.")}
          </h1>
          <p className="home-hero-description">
            {t("Всё для строительства и ремонта.")}
            <br />
            {t("Выбирайте материалы, сравнивайте цены")}
            <br />
            {t("и собирайте заказ в одном месте.")}
          </p>
          <div className="home-hero-actions">
            <Button className="home-button" to="/catalog">
<<<<<<< HEAD
              {t("Открыть каталоq")}
=======
              {t("Открыть каталог")}
>>>>>>> 71e7d489a58ded0d1a0b3bd6cbd265e7b113eacf
              <Icon name="arrow" />
            </Button>
            <Button variant="outline" className="home-button home-button-light" to="/#business">
              {t("Для бизнеса")}
              <Icon name="arrow" />
            </Button>
          </div>
          <p className="home-hero-note">
            <Icon name="layers" />
            {t("От фундамента до последнего штриха")}
          </p>
        </div>
        <div className="home-hero-art">
          <img
            src={hero}
            alt={t("Композиция из бетона, кирпича, металла и дерева")}
            fetchPriority="high"
            width="728"
            height="720"
          />
        </div>
      </section>
      <div className="home-ticker" aria-hidden="true">
        <span>{t("СТРОИМ ОСНОВАТЕЛЬНО")}</span>✦
        <span>{t("ВЫБИРАЕМ ТОЧНО")}</span>✦<span>{t("СОЗДАЁМ НАДОЛГО")}</span>✦
      </div>
    </>
  );
}
