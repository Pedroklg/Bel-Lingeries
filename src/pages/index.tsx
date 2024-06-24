import MainLayout from '../layouts/MainLayout';
import Slider from '../components/Slider';
import CollectionList from '../components/CollectionList';
import NewestProducts from '../components/NewestProducts';

const HomePage = () => {
  return (
    <MainLayout title="Home Page">
      <Slider />
      <CollectionList />
      <NewestProducts limit={5} />
    </MainLayout>
  );
};

export default HomePage;