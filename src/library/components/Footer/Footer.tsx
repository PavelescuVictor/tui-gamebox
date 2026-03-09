import { DefaultTheme } from 'core/themes';

const Footer = () => {
    return <>
        <box style={{ flexDirection: "row", margin: "auto", gap: 5 }}>
            <text style={{ fg: DefaultTheme.overlay2 }}>
                [▲▼] <em>Navigate</em>
            </text>
            <text style={{ fg: DefaultTheme.overlay2 }}>
                [▶] <em>Select</em>
            </text>
        </box>
        <box style={{ margin: "auto", flexDirection: "row", gap: 2 }}>
            <text style={{ margin: "auto", fg: DefaultTheme.overlay2 }}>
                <em>@victorpavn</em>
            </text>
            <text style={{ margin: "auto", fg: DefaultTheme.overlay2 }}>
                <em>github.com/PavelescuVictor</em>
            </text>
        </box>
    </>
}

export default Footer;
