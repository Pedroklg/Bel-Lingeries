import MainLayout from '../layouts/MainLayout';

const AboutPage = () => {
    return (
        <div>
            <h1>About Us</h1>
            <p>This is the about page content.</p>
        </div>
    );
};

AboutPage.getLayout = (page: React.ReactNode) => {
    return (
        <MainLayout title="About Us">
            {page}
        </MainLayout>
    );
};

export default AboutPage;