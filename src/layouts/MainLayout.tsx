import { ReactNode } from 'react';
import Head from 'next/head';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

type MainLayoutProps = {
  children: ReactNode;
  title?: string;
};

const MainLayout = ({ children, title = 'My App' }: MainLayoutProps) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;