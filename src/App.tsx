import { createMachine, state, transition, invoke } from 'robot3'
import { useMachine } from 'react-robot'

const substateMachine = createMachine({
    substate1: state(transition('next', 'substate2')),
    substate2: state(transition('back', 'substate1'), transition('done', 'done')),
    done: state(),
    ///substate4: final('done'),
})

const parentMachine = createMachine({
    state1: state(transition('start', 'state2')),
    state2: invoke(substateMachine, {
        onDone: transition('done', 'state3'), // Listen for 'done' from substate and transition to 'state3'
    }), // This will send 'finishSubstate' when the substate machine finishes
    state3: state(transition('finishSubstate', 'state3')), // Parent listens for 'finishSubstate' event
})

const App = () => {
    const [parentCurrent, parentSend] = useMachine(parentMachine)
    const [subCurrent, subSend] = useMachine(substateMachine)

    const parentState = parentCurrent.name
    const subState = subCurrent.name

    return (
        <>
            <h1>State: {parentState}</h1>
            {parentState === 'state1' && <button onClick={() => parentSend('start')}>state start</button>}
            {parentState === 'state2' && (
                <div className="bg-slate-800 rounded-md">
                    <h2>SubState: {subState}</h2>
                    {subState === 'substate1' && <button onClick={() => subSend('next')}>subState next</button>}
                    {subState === 'substate2' && (
                        <>
                            <button onClick={() => subSend('back')}>subState back</button>
                            <button onClick={() => subSend('done')}>subState done</button>
                        </>
                    )}
                </div>
            )}
            {parentState === 'state3' && <h2>Process Complete!</h2>}
        </>
    )
}

export default App
