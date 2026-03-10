import type { ASCIIFontOptions } from '@opentui/core';
import AsciiTitle from '../../../core/components/AsciiTitle';
import { DefaultTheme } from 'core/themes';

type MainTitleProps = {
    style?: Partial<ASCIIFontOptions>
}

const MainTitle = (props: MainTitleProps) => <box style={{ flexDirection: "row", margin: "auto", ...props.style, gap: 1 }}>
    <AsciiTitle text="Gamebox" font="block"/>
    <AsciiTitle text="tui" font="block" style={{ color: DefaultTheme.sapphire }}/>
</box>

export default MainTitle;
