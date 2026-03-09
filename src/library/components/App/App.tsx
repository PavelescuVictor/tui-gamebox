import MainTitle from 'core/components/MainTitle';
import MainMenu from '../MainMenu';
import Header from '../Header';
import Footer from '../Footer/Footer';

const App = () => {
    return <box style={{ paddingTop: 6, flexDirection: "column", gap: 1, flexGrow: 1 }}>
        <MainTitle/>
        <Header />
        <MainMenu />
        <Footer />
    </box>
};

export default App;
