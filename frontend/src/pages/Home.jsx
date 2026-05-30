import { useSelector } from "react-redux";
import Footer from "./Footer";
import HeroSection from "./HeroSection";
import Navbar from "./Navbar";
import FeedPage from "./FeedPage";

export default function Home() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <>
      <Navbar />
      {isAuthenticated ? (
        <FeedPage />
      ) : (
        <>
          <HeroSection />
          <Footer />
        </>
      )}
    </>
  );
}
