import type { ASCIIFontName, ASCIIFontOptions } from '@opentui/core';
import { DefaultTheme } from 'core/themes';

type AsciiTitleProps = {
    style?: Partial<ASCIIFontOptions>
    font?: ASCIIFontName
    text: string;
}

const DEFAULT_STYLES = {
    margin: "auto",
    color: DefaultTheme.peach,
} satisfies ASCIIFontOptions

const AsciiTitle = (props: AsciiTitleProps) => {
    const {
        style = {},
        text = "",
        font = "block",
    } = props;

    return <ascii-font
        style={{
            ...DEFAULT_STYLES,
            ...style,
        }}
        text={text}
        font={font}
    />
}

export default AsciiTitle;
