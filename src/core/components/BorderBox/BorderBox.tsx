import type { BoxOptions, } from "@opentui/core";
import type { PropsWithChildren } from 'react';
import { DefaultTheme } from "core/themes";

const DEFAULT_STYLES: Partial<BoxOptions> = {
    border: true,
    borderColor: DefaultTheme.mauve,
    borderStyle: "heavy",
    focusedBorderColor: DefaultTheme.peach,
};

type BorderBoxProps = {
    focus?: boolean;
    style?: Partial<BoxOptions>;
};

const Box = (props: PropsWithChildren<BorderBoxProps>) => {
    const { focus = false, style = {} } = props;

    return (
        <box
            style={{
                ...DEFAULT_STYLES,
                ...style,
            }}
            focused={focus}
        >
            {props.children}
        </box>
    );
};

export default Box;
