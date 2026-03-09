import KeyboardAnimatedWord from 'core/components/KeyboardAnimatedWord';
import { DefaultTheme } from 'core/themes';

const resetSteps = ['playful', 'playfu', 'playf', 'play', 'pla', 'pl', 'p', ''];
const steps = ['p', 'pl', 'pla', 'play', 'playc', 'playca', 'playcat', 'playca', 'playc', 'play', 'playf', 'playfu', 'playful'];

const Header = () => {
    return <box style={{ flexDirection: "row", margin: "auto", gap: 1 }}>
        <text>Seek the time to be</text>
        <KeyboardAnimatedWord steps={steps} resetSteps={resetSteps} />
        <text style={{ fg: DefaultTheme.peach }}>
            <strong>|</strong>
        </text>
        <text>Even in your</text>
        <text style={{ fg: DefaultTheme.teal }}>
            {">_"}<em>Terminal</em>
        </text>
    </box>
}

export default Header;
