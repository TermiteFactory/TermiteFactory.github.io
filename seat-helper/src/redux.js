import { configureStore } from '@reduxjs/toolkit';

// Actions
export const SELECT_ID = 'SELECT_ID';
export const createSelectId = (id, orderNum) => {
    return {
        type: SELECT_ID,
        payload: {
            id,
            orderNum,
        }
    };
};

export const UNSELECT_ID = 'UNSELECT_ID';
export const createUnSelectId = (id, orderNum) => {
    return {
        type: UNSELECT_ID,
        payload: {
            id,
            orderNum,
        }
    };
};

export const DONE_ALLOC = 'DONE_ALLOC';
export const createDoneAlloc = () => {
    return {
        type: DONE_ALLOC,
        payload: null,
    };
};

export const CHECK_IN = 'CHECK_IN';
export const createCheckIn = (id) => {
    return {
        type: CHECK_IN,
        payload: id
    };
};

export const UNCHECK_IN = 'UNCHECK_IN';
export const createUnCheckIn = (id) => {
    return {
        type: UNCHECK_IN,
        payload: id
    };
};

// Reducers 
const initialAppState = {
    people: [
        {
            uniqueId: 5,
            orderNum: '2RBD-9R2V-PK3',
            name: 'PAK MENG LEE',
            tixType: '2/1 - (A+B/Grand Staircase)',
            telephone: '97514326',
            allocZone: null,
            allocRow: null,
            checkin: false,
        }
    ],
    idsSelectForAlloc: [],
    orderSelectForAlloc: null,
    zoneInfo: [
        {
            id: 'A',
            rows: 10,
            seats: 8,
        },
        {
            id: 'B',
            rows: 10,
            seats: 8,
        }
    ],
    zoneRowSelect: null,
};

export const appState = (state = initialAppState, action) => {
    const { type, payload } = action;

    switch (type) {
        case SELECT_ID: {
            // Add the id to the idsSelectForAlloc and add to orderSelectForAlloc if it is null
            return {
                ...state,
                time: {
                    ...state.time,
                    currentTime: payload,
                },
            };
        }
        case UNSELECT_ID: {
            // Remove the ids from the idsSelectForAlloc and set the orderSelectForAlloc to null if ids are empty
            return {
                ...state,
                time: {
                    ...state.time,
                    currentTime: payload,
                },
            };
        }
        case DONE_ALLOC: {
            // Take the zoneRowSelect and update all the selected ids with the allocation
            return {
                ...state,
                time: {
                    ...state.time,
                    currentTime: payload,
                },
            };
        }
        case CHECK_IN: {
            // Update the person's checkin status to true
            return {
                ...state,
                time: {
                    ...state.time,
                    currentTime: payload,
                },
            };
        }
        case UNCHECK_IN: {
            // Update the person's checkin status to false
            return {
                ...state,
                time: {
                    ...state.time,
                    currentTime: payload,
                },
            };
        }
        default:
            return state;
    }
};

// Store
export const store = configureStore({
    reducer: {
        appState,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            //immutableCheck: false,
            //serializableCheck: false
        })
});

// Selectors 
export const getPeople = (state) => state.appState.people;

export const getZoneInfo = (state) => state.appState.zoneInfo;
