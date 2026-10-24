import { Link } from "react-router";
import { useCatalog } from "../../api/useCatalog.js";
import { ListingState } from "../ui/ListingState.jsx";
import { useLanguage } from "../../i18n/useLanguage.js";
import Icon from "./Icon.jsx";
import "../../pages/RentalsPage.css";

export default function RentalFeature() {
  const { t } = useLanguage();
  const {items,loading,error}=useCatalog("rentals");
  return (
    <section
      className="home-container home-section"
      aria-labelledby="rental-title"
    >
      <div className="home-section-heading">
        <div>
          <p className="home-section-label">STROY UZ / RENTAL</p>
          <h2 id="rental-title">{t("Аренда техники")}</h2>
        </div>
        <Link to="/rentals">
          {t("Вся техника")}
          <Icon name="arrow" />
        </Link>
      </div>
      <ListingState loading={loading} error={error} empty={!items.length}/>
      <div className="rental-grid">
        {items.slice(0,3).map((item) => (
          <article className="rental-card" key={item.id}>
            <Link to={"/rentals/" + item.id}>
              <img
                src={item.image}
                alt={t(item.category)}
                loading="lazy"
                width="800"
                height="600"
              />
              <div className="rental-card-body">
                <h3>{t(item.category)}</h3>
                <p>{t("Условия аренды")} →</p>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
