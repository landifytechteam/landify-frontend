import { About } from "../components/landing/About";
import { CallToAction } from "../components/landing/CallToAction";
import { FeaturedProperties } from "../components/landing/FeaturedProperties";
import { Faq } from "../components/landing/Faq";
import { Hero } from "../components/landing/Hero";
import { HowItWorks } from "../components/landing/HowItWorks";
import { PaymentPlans } from "../components/landing/PaymentPlans";
import { Roles } from "../components/landing/Roles";
import { SearchBar } from "../components/landing/SearchBar";
import { WhyChooseUs } from "../components/landing/WhyChooseUs";
import { featuredProperties } from "../data/landing";
import { useFeaturedProperties } from "../context/public/useFeaturedProperties";

export default function LandingPage() {
  // Live listings from the API, or the demo ones while loading / if none exist
  const properties = useFeaturedProperties(featuredProperties);

  return (
    // MainLayout already renders the Navbar, Footer and <main>
    <>
      <Hero />
      <SearchBar />
      <FeaturedProperties properties={properties} />
      <About />
      <WhyChooseUs />
      <HowItWorks />
      <PaymentPlans />
      <Roles />
      <Faq />
      <CallToAction />
    </>
  );
}