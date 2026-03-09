import { useTimeline } from '@opentui/react';
import { DefaultTheme } from 'core/themes';
import { useEffect, useState, useRef } from 'react';

type PulsatingCharacter = {
    character: string,
    active: boolean,
}

const ON_TIME = 600;
const OFF_TIME = 250;

const PulsatingCharacter = (props: PulsatingCharacter) => {
    const { character, active = false  } = props;
    const [visible, setVisible] = useState(true);
    const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

    const resetTimeout = () => {
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }
    }

    useEffect(() => {
        if (!active) {
            resetTimeout();
            return;
        }

        resetTimeout();
        timeoutId.current = setTimeout(() => {
            setVisible(prevValue => !prevValue);
        }, visible ? ON_TIME : OFF_TIME);

        return () => {
            resetTimeout();
        }
    }, [visible, active]);

    return <text style={{ fg: visible ? DefaultTheme.mantle : DefaultTheme.peach }}>{character}</text>
}

type KeyboardAnimatedWordProps = {
    steps: Array<string>
    resetSteps: Array<string>
}

const KeyboardAnimatedWord = (props: KeyboardAnimatedWordProps) => {
    const { steps = [], resetSteps = [] } = props;

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [{ isReverse, index, reset, paused }, setAnimationState] = useState({
        isReverse: false,
        index: 0,
        reset: false,
        paused: false,
    })

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }

    useEffect(() => {
        if (!reset && index >= steps.length - 1) {
            resetTimeout();
            setAnimationState(prevState => ({
               ...prevState,
                paused: true,
            }));
            timeoutRef.current = setTimeout(() => {
                setAnimationState({
                    reset: true,
                    isReverse: false,
                    index: 0,
                    paused: false,
                });
            }, 3000);

            return;
        }

        if (reset && index >= resetSteps.length - 1) {
            resetTimeout();
            timeoutRef.current = setTimeout(() => {
                setAnimationState({
                    reset: false,
                    isReverse: false,
                    index: 0,
                    paused: false,
                });
            }, 1000);

            return;
        }

        resetTimeout();
        timeoutRef.current = setTimeout(() => {
            setAnimationState(prevState => ({
                ...prevState,
                index: prevState.index + 1,
                isReverse: reset ? isReverse : (steps[prevState.index + 1]!.length < steps[prevState.index]!.length)
            }));
        }, reset ? 10 : (isReverse ? 80 : 200));

        return () => { resetTimeout() }
    }, [index])

    return <box style={{
        flexDirection: "row",
        width: 10,
        paddingLeft: 1,
        paddingRight: 1,
        backgroundColor: DefaultTheme.peach
    }}>
        <text style={{
            width: reset ? resetSteps[index]!.length : steps[index]!.length,
            height: 1,
            overflow: "hidden",
            fg: DefaultTheme.mantle
        }}>
            <em>{reset ? resetSteps[index] : steps[index]}</em>
        </text>
        <PulsatingCharacter character="_" active={paused}/>
    </box>

}

export default KeyboardAnimatedWord;
