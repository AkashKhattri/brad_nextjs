import { fetchProperties } from "@/utils/request";
import { FaBath, FaBed, FaMoneyBill, FaRulerCombined } from "react-icons/fa";
import PropertyCard from "./PropertyCard";
import FeaturedCard from "./FeaturedCard";

const FeaturedProperties = async () => {
  const properties = await fetchProperties({ showFeatured: true });

  return (
    <section className="bg-blue-50 px-4 pt-6 pb-10">
      <div className="container-xl lg:container m-auto">
        <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">
          Featured Properties
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {properties &&
            properties.map((property, index) => (
              <FeaturedCard property={property} key={index} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
