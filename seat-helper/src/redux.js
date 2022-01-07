import { configureStore } from '@reduxjs/toolkit';
import { parse, unparse } from 'papaparse';

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

export const CHOOSE_SEAT = 'CHOOSE_SEAT';
export const createChooseSeat = (zone, row) => {
    return {
        type: CHOOSE_SEAT,
        payload: {
            zone,
            row
        }
    };
};

export const MENU = 'MENU';
export const createMenu = () => {
    return {
        type: MENU,
        payload: null
    };
};

export const UNMENU = 'UNMENU';
export const createUnmenu = () => {
    return {
        type: UNMENU,
        payload: null
    };
};

export const ADD_ZONE = 'ADD_ZONE';
export const createAddZone = (zoneid) => {
    return {
        type: ADD_ZONE,
        payload: zoneid
    };
};

export const REMOVE_ZONE = 'REMOVE_ZONE';
export const createRemoveZone = (zoneid) => {
    return {
        type: REMOVE_ZONE,
        payload: zoneid
    };
};

export const FILE_LOADED = 'FILE_LOADED';
export const createFileLoaded = (data) => {
    return {
        type: FILE_LOADED,
        payload: data
    };
};

export const ADD_PERSON = 'ADD_PERSON';
export const createAddPerson = (person) => {
    return {
        type: ADD_PERSON,
        payload: person
    };
};

export const ADD_ACTIVETICKETS = 'ADD_ACTIVETICKETS';
export const createAddActiveTickets = (ticket) => {
    return {
        type: ADD_ACTIVETICKETS,
        payload: ticket
    };
};

export const REMOVE_ACTIVETICKETS = 'REMOVE_ACTIVETICKETS';
export const createRemoveActiveTickets = (ticket) => {
    return {
        type: REMOVE_ACTIVETICKETS,
        payload: ticket
    };
};

export const RESET_DATA = 'RESET_DATA';
export const createResetData = () => {
    return {
        type: RESET_DATA,
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
            allocZone: 'A',
            allocRow: 2,
            checkin: false,
            absent: false,
        },
        {
            uniqueId: 2,
            orderNum: '2RBD-9VWL-1K9',
            name: 'Tan Ah Kow Super duper long name',
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
            tixType: '2/1-(CRYROOM/Carpark Entry)',
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
        },
        {
            id: 'C',
            rows: 10,
            seats: 8,
        },
        {
            id: 'D',
            rows: 7,
            seats: 3,
        },
        {
            id: 'CR',
            rows: 1,
            seats: 16,
        }
    ],
    lastSelectZone: null,
    selectZone: null,
    selectRow: null,
    filterText: '',
    filterOnlyUnentered: false,
    showMenu: false,
    activatedZones: ['A', 'B'],
    loadedFile: 'test_data.csv',
    activeTickets: ['2/1 - (A+B/Grand Staircase)', '2/1-(CRYROOM/Carpark Entry)'],
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
                selectZone: newIdsSelect.length === 0 ? null : state.selectZone,
                selectRow: newIdsSelect.length === 0 ? null : state.selectRow,
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
                selectZone: null,
                selectRow: null,
                lastSelectZone: state.selectZone,
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
                            allocZone: null,
                            allocRow: null,
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
        case MENU: {
            // Update the person's checkin status to false
            return {
                ...state,
                showMenu: true,
            };
        }
        case UNMENU: {
            // Update the person's checkin status to false
            return {
                ...state,
                showMenu: false,
            };
        }
        case CHOOSE_SEAT: {
            // Update the person's checkin status to false
            return {
                ...state,
                selectZone: payload.zone,
                selectRow: payload.row,
            };
        }
        case ADD_ZONE: {
            // Update the person's checkin status to false
            return {
                ...state,
                activatedZones: state.activatedZones.concat(payload)
            };
        }
        case REMOVE_ZONE: {
            // Update the person's checkin status to false
            return {
                ...state,
                activatedZones: state.activatedZones.filter(id => id !== payload)
            };
        }
        case FILE_LOADED: {
            if ('data' in payload) {
                let id = 1;
                return {
                    ...state,
                    people: payload.data.map(person => {
                        return {
                            uniqueId: id++,
                            ...person,
                            allocZone: null,
                            allocRow: null,
                            checkin: false,
                            absent: false,
                        }
                    }),
                    lastSelectZone: null,
                    selectZone: null,
                    selectRow: null,
                    filterText: '',
                    filterOnlyUnentered: false,
                    activatedZones: [],
                    activeTickets: [],
                    loadedFile: payload.filename,
                };
            } else {
                return state;
            }
        }
        case ADD_PERSON: {
            // Update the person's checkin status to false
            const nextId = state.people.reduce((result, person) => person.uniqueId > result ? person.uniqueId : result, 0) + 1;
            return {
                ...state,
                people: state.people.concat({
                    ...payload,
                    orderNum: `ENTRY-ORDER-${nextId}`,
                    uniqueId: nextId,
                    allocZone: null,
                    allocRow: null,
                    checkin: false,
                    absent: false,
                })
            };
        }
        case ADD_ACTIVETICKETS: {
            // Update the person's checkin status to false
            return {
                ...state,
                activeTickets: state.activeTickets.concat(payload),
            };
        }
        case REMOVE_ACTIVETICKETS: {
            // Update the person's checkin status to false
            return {
                ...state,
                activeTickets: state.activeTickets.filter(tix => payload !== tix)
            };
        }
        case RESET_DATA: {
            // Update the person's checkin status to false
            return {
                ...initialAppState,
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

export const getSelectZone = (state) => state.appState.selectZone;

export const getSelectRow = (state) => state.appState.selectRow;

export const getLastSelectZone = (state) => state.appState.lastSelectZone;

export const getMenu = (state) => state.appState.showMenu;

export const getActivatedZones = (state) => state.appState.activatedZones;

export const getLoadedFile = (state) => state.appState.loadedFile;

export const getActiveTickets = (state) => state.appState.activeTickets;

const fieldMapping = {
    'Order number': 'orderNum',
    'Guest name': 'name',
    'Ticket type': 'tixType',
    'Mobile Number': 'telephone',
}

// Thunks
export const loadFile = (fileObj) => async (dispatch, getState) => {
    try {
        parse(fileObj, {
            complete: (results) => {
                const actualMap = {}
                Object.keys(results.data[0]).forEach(heading => {
                    Object.keys(fieldMapping).forEach(key => {
                        if (heading.indexOf(key) !== -1) {
                            actualMap[heading] = fieldMapping[key]
                        }
                    })
                })
                const mappedData = results.data.filter(person => {
                    let ok = true;
                    Object.keys(actualMap).forEach(key => {
                        if (person[key] == null) {
                            ok = false;
                        }
                    })
                    return ok;
                }).map(person => {
                    const new_person = {}
                    Object.keys(actualMap).forEach(key => {
                        new_person[actualMap[key]] = person[key]
                    })
                    return new_person
                })
                dispatch(createFileLoaded({ data: mappedData, filename: fileObj.name }));
            },
            header: true
        });
    } catch {
        dispatch(
            createFileLoaded({ error: `Error Loading File: ${fileObj.name}` })
        );
    }
};


export const downloadFile = (fileName) => async (dispatch, getState) => {
    const fields = Object.keys(fieldMapping);
    fields.push('Zone')
    fields.push('Row')
    fields.push('Checkin')
    fields.push('Absent')
    const state = getState();
    const mappedData = state.appState.people.filter(person => {
        return state.appState.activeTickets.indexOf(person.tixType) !== -1 || person.tixType === 'On Entry'
    }).map(person => {
        const new_person = {}
        Object.keys(fieldMapping).forEach(key => {
            new_person[key] = person[fieldMapping[key]]
        })
        new_person['Zone'] = person.allocZone
        new_person['Row'] = person.allocRow
        new_person['Checkin'] = person.checkin
        new_person['Absent'] = person.absent
        return new_person;
    })
    const csv = unparse({
        data: mappedData,
        fields
    });
    const blob = new Blob([csv]);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob, { type: 'text/plain' });
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};