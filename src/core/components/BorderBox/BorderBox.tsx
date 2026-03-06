import type { BoxOptions } from "@opentui/core";
import { DefaultTheme } from "core/themes";

const DefaultStyles: Partial<BoxOptions> = {
    border: true,
    borderColor: DefaultTheme.mauve,
    borderStyle: "heavy",
    focusedBorderColor: DefaultTheme.peach,
};

type BorderBoxProps = {
    focus?: boolean;
    style?: Partial<BoxOptions>;
};

const Box = (props: React.PropsWithChildren<BorderBoxProps>) => {
    const { focus = false, style = {} } = props;

    return (
        <box
            focused={focus}
            style={{
                ...DefaultStyles,
                ...style,
            }}
        >
            {props.children}
        </box>
    );
};

export default Box;
