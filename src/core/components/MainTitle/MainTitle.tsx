import type { ASCIIFontName, ASCIIFontOptions } from '@opentui/core';
import AsciiTitle from '../AsciiTitle';
import { DefaultTheme } from 'core/themes';

type MainTitleProps = {
    style?: Partial<ASCIIFontOptions>
}

const MainTitle = (props: MainTitleProps) => <box style={{ flexDirection: "row", margin: "auto", ...props.style }}>
    <AsciiTitle text="Gamebox" font="block"/>
    <AsciiTitle text="tui" font="block" style={{ color: DefaultTheme.sapphire }}/>
</box>

export default MainTitle;
