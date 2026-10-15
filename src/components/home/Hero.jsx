import hero from "../../assets/home/hero.png";
import Icon from "./Icon.jsx";
import { Link } from "react-router";

export default function Hero() {
  return (
    <>
      <section className="home-hero" aria-labelledby="hero-title">
        <div className="home-hero-copy">
          <p className="home-eyebrow">МАТЕРИАЛЫ ДЛЯ БОЛЬШИХ ИДЕЙ</p>
          <h1 id="hero-title">
            ОТ ОСНОВЫ.
            <br />
            ДО ВЕРШИНЫ.
          </h1>
          <p className="home-hero-description">
            Всё для строительства и ремонта.
            <br />
            Выбирайте материалы, сравнивайте цены
            <br />и собирайте заказ в одном месте.
          </p>
          <div className="home-hero-actions">
            <Link className="home-button" to="/catalog">
              Открыть каталог <Icon name="arrow" />
            </Link>
            <a className="home-button home-button-light" href="#business">
              Для бизнеса <Icon name="arrow" />
            </a>
          </div>
          <p className="home-hero-note">
            <Icon name="layers" />
            От фундамента до последнего штриха
          </p>
        </div>
        <div className="home-hero-art">
          <img
            src={hero}
            alt="Композиция из бетона, кирпича, металла и дерева"
            fetchPriority="high"
            width="728"
            height="720"
          />
        </div>
      </section>
      <div className="home-ticker" aria-hidden="true">
        <span>СТРОИМ ОСНОВАТЕЛЬНО</span>✦<span>ВЫБИРАЕМ ТОЧНО</span>✦
        <span>СОЗДАЁМ НАДОЛГО</span>✦
      </div>
    </>
  );
}
