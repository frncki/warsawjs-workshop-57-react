import * as React from 'react';
import { useInterpret } from '@xstate/react';
import { assign, createMachine } from 'xstate';
import { delay } from './utils';

const authMachine = createMachine(
    {
        id: 'auth',
        initial: 'loggedOut',
        states: {
            loggedIn: { on: { LOGOUT: 'loggedOut' } },
            loggedOut: { on: { LOGIN: 'authenticating' } },
            authenticating: {
                invoke: {
                    src: 'performLogin',
                    onDone: { target: 'loggedIn' },
                    onError: { target: 'loggedOut' },
                },
            },
        },
    },

    {
        services: {
            performLogin: async (ctx, event) => {
                console.log({ event });
                const { type, ...payload } = event;
                await delay(500);
                if (payload.password === 'admin') {
                    return await Promise.resolve(payload);
                } else {
                    return await Promise.reject('Nieprawidłowe hasło');
                }
            },
        },
    }
);

export const GlobalStateContext = React.createContext({});

export const GlobalStateProvider = (props) => {
    const authService = useInterpret(authMachine);

    return (
        <GlobalStateContext.Provider value={authService}>
            {props.children}
        </GlobalStateContext.Provider>
    );
};