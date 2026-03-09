import type { BoxOptions } from '@opentui/core';
import { Fragment, type PropsWithChildren } from 'react';
import { BorderBox } from '../BorderBox';
import { DefaultTheme } from 'core/themes';

const LABEL_POSITION = {
    BOTTOM_RIGHT: 'bottom-right',
    BOTTOM_LEFT: 'bottom-left',
    BOTTOM_CENTER: 'bottom-center',
    TOP_RIGHT: 'top-right',
    TOP_LEFT: 'top-left',
    TOP_CENTER: 'top-center',
} as const;

type LabelPosition = typeof LABEL_POSITION[keyof typeof LABEL_POSITION];
type LabeledBoxProps = {
    focus?: boolean;
    style?: Partial<BoxOptions>;
    withBorder?: boolean;
    label?: string;
    position?: LabelPosition;
};

const DEFAULT_STYLES = {
    bg: DefaultTheme.mauve,
    fg: DefaultTheme.base
}

const POSITION_TO_STYLE = {
    [LABEL_POSITION.TOP_LEFT]: {
        top: -1,
        alignSelf: "flex-start",
        left: 2,
    },
    [LABEL_POSITION.TOP_RIGHT]: {
        top: -1,
        alignSelf: "flex-end",
        right: 2,
    },
    [LABEL_POSITION.TOP_CENTER]: {
        top: -1,
        alignSelf: "center"
    },
    [LABEL_POSITION.BOTTOM_LEFT]: {
        bottom: -1,
        alignSelf: "flex-start",
        left: 2,
    },
    [LABEL_POSITION.BOTTOM_RIGHT]: {
        bottom: -1,
        alignSelf: "flex-end",
        right: 2,
    },
    [LABEL_POSITION.BOTTOM_CENTER]: {
        bottom: -1,
        alignSelf: "center",
    },
} satisfies Record<LabelPosition, Partial<BoxOptions>>;

const LabeledBox = (props: PropsWithChildren<LabeledBoxProps>) => {
    const {
        style = {},
        withBorder = false,
        label = "",
        position = LABEL_POSITION.TOP_RIGHT,
    } = props;

    const Wrapper = withBorder ? BorderBox : Fragment;

    return <Wrapper style={style}>
        <text style={{
            ...DEFAULT_STYLES,
            ...POSITION_TO_STYLE[position],
        }}>
            {`[ ${label} ]`}
        </text>
        {props.children}
    </Wrapper>
}

export default LabeledBox;
