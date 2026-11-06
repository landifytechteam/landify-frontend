import { About } from "../components/landing/About";
import { CallToAction } from "../components/landing/CallToAction";
import { FeaturedProperties } from "../components/landing/FeaturedProperties";
import { Hero } from "../components/landing/Hero";
import { HowItWorks } from "../components/landing/HowItWorks";
import { PaymentPlans } from "../components/landing/PaymentPlans";
import { Roles } from "../components/landing/Roles";
import { SearchBar } from "../components/landing/SearchBar";
import { WhyChooseUs } from "../components/landing/WhyChooseUs";
import { featuredProperties } from "../data/landing";

export default function LandingPage() {
  // TODO: swap for the API once it exists, e.g.
  // const [properties, setProperties] = useState([]);
  // useEffect(() => {
  //   fetch(`${import.meta.env.VITE_API_URL}/properties?featured=true`)
  //     .then((r) => r.json())
  //     .then(setProperties);
  // }, []);
  const properties = featuredProperties;

  return (
    <>
      {/* <Navbar /> */}
      <main>
        <Hero />
        <SearchBar />
        <FeaturedProperties properties={properties} />
        <About />
        <WhyChooseUs />
        <HowItWorks />
        <PaymentPlans />
        <Roles />
        <CallToAction />
      </main>
    </>
  );
}