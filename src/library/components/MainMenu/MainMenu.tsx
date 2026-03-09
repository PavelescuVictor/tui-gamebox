import Menu from 'core/components/Menu';
import { DefaultTheme } from 'core/themes';
import { useState } from 'react';

const Menus = {
    MAIN: 'main',
    PLAY: 'play',
}

const MainMenuOptions = [
    { name: "Play", description: "", value: "play" },
    { name: "Game Library", description: "", value: "game-library" },
    { name: "Settings", description: "", value: "settings" },
    { name: "About", description: "", value: "about" },
    { name: "Exit", description: "", value: "exit" },
]

const PlayMenuOptions = [
    { name: "Continue Last Game", description: "", value: "continue-last-game" },
    { name: "Recently Played", description: "", value: "recently-played" },
    { name: "Favorites", description: "", value: "favorites" },
    { name: "Random Game", description: "", value: "random-game" },
    { name: "Back", description: "", value: "back" },
]

const MainMenu = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const onChange = (index: number) => {
        setSelectedIndex(index);
    }

    return <box style={{ flexGrow: 1, paddingTop: 3 }}>
        <Menu
            options={MainMenuOptions}
            onChange={onChange}
            selectedIndex={selectedIndex}
        />
    </box>
}

export default MainMenu;
