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
export const createUnSelectId = (id) => {
    return {
        type: UNSELECT_ID,
        payload: id
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

export const ABSENT = 'ABSENT';
export const createAbsent = (id) => {
    return {
        type: ABSENT,
        payload: id
    };
};

export const UNABSENT = 'UNABSENT';
export const createUnAbsent = (id) => {
    return {
        type: UNABSENT,
        payload: id
    };
};

export const FILTER_TEXT = 'FILTER_TEXT';
export const createFilterText = (text) => {
    return {
        type: FILTER_TEXT,
        payload: text
    };
};

export const FILTER_ONLYUNENTERED = 'FILTER_ONLYUNENTERED';
export const createFilterOnlyUnentered = () => {
    return {
        type: FILTER_ONLYUNENTERED,
        payload: null
    };
};

export const UNFILTER_ONLYUNENTERED = 'UNFILTER_ONLYUNENTERED';
export const createUnFilterOnlyUnentered = () => {
    return {
        type: UNFILTER_ONLYUNENTERED,
        payload: null
    };
};

// Reducers 
const initialAppState = {
    people: [
        {
            uniqueId: 1,
            orderNum: '2RBD-9R2V-PK3',
            name: 'KAH Kwee Ann',
            tixType: '2/1 - (A+B/Grand Staircase)',
            telephone: '91111123',
            allocZone: null,
            allocRow: null,
            checkin: false,
            absent: false,
        },
        {
            uniqueId: 5,
            orderNum: '2RBD-9R2V-PK3',
            name: 'JOSEPH TAN',
            tixType: '2/1 - (A+B/Grand Staircase)',
            telephone: '92222222',
            allocZone: null,
            allocRow: null,
            checkin: false,
            absent: false,
        },
        {
            uniqueId: 2,
            orderNum: '2RBD-9VWL-1K9',
            name: 'Tan Ah Kow',
            tixType: '2/1 - (A+B/Grand Staircase)',
            telephone: '96314542',
            allocZone: null,
            allocRow: null,
            checkin: false,
            absent: false,
        },
        {
            uniqueId: 3,
            orderNum: '2RBD-B7GF-74B',
            name: 'Mary Tan',
            tixType: '2/1 - (A+B/Grand Staircase)',
            telephone: '92234562',
            allocZone: null,
            allocRow: null,
            checkin: false,
            absent: false,
        },
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
    selectZone: null,
    selectRow: null,
    filterText: '',
    filterOnlyUnentered: false,
};

export const appState = (state = initialAppState, action) => {
    const { type, payload } = action;

    switch (type) {
        case FILTER_TEXT: {
            // Add Filter Text
            return {
                ...state,
                filterText: payload
            };
        }
        case FILTER_ONLYUNENTERED: {
            // Add Filter
            return {
                ...state,
                filterOnlyUnentered: true
            };
        }
        case UNFILTER_ONLYUNENTERED: {
            // Remove filter 
            return {
                ...state,
                filterOnlyUnentered: false
            };
        }
        case SELECT_ID: {
            // Add the id to the idsSelectForAlloc and add to orderSelectForAlloc if it is null
            return {
                ...state,
                idsSelectForAlloc: state.idsSelectForAlloc.indexOf(payload.id) === -1 ?
                    state.idsSelectForAlloc.concat(payload.id) : state.idsSelectForAlloc,
                orderSelectForAlloc: payload.orderNum,
            };
        }
        case UNSELECT_ID: {
            // Remove the ids from the idsSelectForAlloc and set the orderSelectForAlloc to null if ids are empty
            const newIdsSelect = state.idsSelectForAlloc.filter((id) => id !== payload);

            return {
                ...state,
                idsSelectForAlloc: newIdsSelect,
                orderSelectForAlloc: newIdsSelect.length === 0 ? null : state.orderSelectForAlloc,
            };
        }
        case DONE_ALLOC: {
            // Take the zoneRowSelect and update all the selected ids with the allocation
            return {
                ...state,
                people: state.people.map(person => {
                    if (state.idsSelectForAlloc.includes(person.uniqueId)) {
                        return {
                            ...person,
                            allocZone: state.selectZone,
                            allocRow: state.selectRow,
                        };
                    } else {
                        return person;
                    }
                }),
                idsSelectForAlloc: [],
                orderSelectForAlloc: null,
            };
        }
        case CHECK_IN: {
            // Update the person's checkin status to true
            return {
                ...state,
                people: state.people.map(person => {
                    if (payload === person.uniqueId) {
                        return {
                            ...person,
                            checkin: true,
                        };
                    } else {
                        return person;
                    }
                }),
            };
        }
        case UNCHECK_IN: {
            // Update the person's checkin status to false
            return {
                ...state,
                people: state.people.map(person => {
                    if (payload === person.uniqueId) {
                        return {
                            ...person,
                            checkin: false,
                        };
                    } else {
                        return person;
                    }
                }),
            };
        }
        case ABSENT: {
            // Update the person's checkin status to false
            return {
                ...state,
                people: state.people.map(person => {
                    if (payload === person.uniqueId) {
                        return {
                            ...person,
                            absent: true,
                        };
                    } else {
                        return person;
                    }
                }),
            };
        }
        case UNABSENT: {
            // Update the person's checkin status to false
            return {
                ...state,
                people: state.people.map(person => {
                    if (payload === person.uniqueId) {
                        return {
                            ...person,
                            absent: false,
                        };
                    } else {
                        return person;
                    }
                }),
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

export const getIdsSelectForAlloc = (state) => state.appState.idsSelectForAlloc;

export const getOrderSelectForAlloc = (state) => state.appState.orderSelectForAlloc;

export const getFilteredText = (state) => state.appState.filterText;

export const getFilterUnentered = (state) => state.appState.filterOnlyUnentered;