import HeroSlider from '../components/HeroSlider'
import FeaturesBar from '../components/FeaturesBar'
import BestSellers from '../components/BestSellers'
import Collections from '../components/Collections'
import Reviews from '../components/Reviews'
import DiscordCTA from '../components/DiscordCTA'

export default function Home() {
  return (
    <div>
      <HeroSlider />
      <FeaturesBar />
      <BestSellers />
      <Collections />
      <Reviews />
      <DiscordCTA />
    </div>
  )
}
