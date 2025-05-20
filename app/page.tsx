import Navbar from "./components/Navbar";
import Card from "./components/Card";
import Kategori from "./components/Kategori";
import Banner from "./components/Banner";
import CategoryBox from "./components/CategoryBox";
import CategoryBannerGrid from "./components/CategoryBannerGrid";
import TopBrandsCarousel from "./components/TopBrandsCarousel";
import Footer from "./components/Footer";

const Page = () => {
  return (
    <div>
      <Navbar />
      <div className="pt-16">
        <Kategori />
        <Banner />
        <CategoryBox />
        <CategoryBannerGrid />
        <TopBrandsCarousel />
        <Card />
        <Footer />
      </div>
    </div>
  );
};

export default Page;
