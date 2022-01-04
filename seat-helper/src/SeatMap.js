import { connect } from 'react-redux';
import { Navbar, Button, Nav, Tab, Row, Col } from 'react-bootstrap';
import styled from 'styled-components'
import {
    getPeople,
    getZoneInfo,
    getIdsSelectForAlloc,
    getSelectRow,
    getSelectZone,
    createChooseSeat,
    createDoneAlloc,
} from './redux';

const Seat = styled.div`
    height: 30px;
    width: 30px;
    ${({ type }) => {
        if (type === 'taken') {
            return 'background-color: grey;'
        }
        else if (type === 'chosen') {
            return 'background-color: orange;'
        }
        else {
            return 'background-color: powderblue;'
        }
    }}
    margin-left: 5px;
    margin-right: 5px;
    display: inline-block;
`

const RowContainer = styled.div`
    position: relative;
`

const ConfirmButton = styled(Button)`
    position: relative;
`

const Footer = styled.div`
    position: sticky;
    bottom: 0;
    background-color: white;
    max-height: 60vh;
    overflow: scroll;
    padding: 10px;
    padding-left: 10vw;
`

const SeatMap = ({ people,
    zoneInfo,
    idSelectForAlloc,
    selectZone,
    selectRow,
    onChooseSeat,
    onDoneAlloc }) => {
    if (idSelectForAlloc.length > 0) {

        // Tabs
        const tabs = zoneInfo.reduce((result, zone) => {
            return result.concat(<Nav.Item>
                <Nav.Link eventKey={zone.id}>Zone {zone.id}</Nav.Link>
            </Nav.Item>)
        }, [])

        // Rows
        const content = zoneInfo.reduce((result, zone) => {
            const rows = []
            for (let i = 0; i < zone.rows; i++) {
                let takenList = people.reduce((result, person) => {
                    if (idSelectForAlloc.indexOf(person.uniqueId) === -1 &&
                        person.allocZone === zone.id &&
                        person.allocRow === i + 1) {
                        if (person.orderNum in result) {
                            result[person.orderNum]++;
                        } else {
                            result[person.orderNum] = 1;
                        }
                    }
                    return result;
                }, {});
                console.log(takenList)

                let rowSelected = selectZone === zone.id && (selectRow - 1) === i
                let row = [<Button className="btn-sm"
                    variant={rowSelected ? "success" : "outline-success"}
                    onClick={() => rowSelected ? onChooseSeat(null, null) : onChooseSeat(zone.id, i + 1)}>Row {i + 1}</Button>]


                // Render Taken 
                let remaining = zone.seats;
                Object.keys(takenList).forEach((key) => {
                    for (let j = 0; j < takenList[key]; j++) {
                        // Seat can be free, taken, choosen
                        row.push(<Seat type='taken' />)
                        remaining--;
                    }
                });

                // Render Chosen
                if (rowSelected) {
                    for (let j = 0; j < idSelectForAlloc.length; j++) {
                        // Seat can be free, taken, choosen
                        row.push(<Seat type='chosen' />)
                        remaining--;
                    }
                }

                // Render Free
                for (let j = 0; j < remaining; j++) {
                    // Seat can be free, taken, choosen
                    row.push(<Seat type='free' />)
                }

                rows.push(<RowContainer>{row}</RowContainer>);
            }
            return result.concat(<Tab.Pane eventKey={zone.id}>
                {rows}
            </Tab.Pane>)
        }, [])

        return <Footer>
            <Tab.Container id="left-tabs-example" defaultActiveKey={zoneInfo[0].id}>
                <Row>
                    <Col sm={3}>
                        <Nav variant="pills" className="flex-column">
                            {tabs}
                        </Nav>
                    </Col>
                    <Col sm={9}>
                        <Tab.Content>
                            {content}
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
            <ConfirmButton onClick={() => onDoneAlloc()}>Confirm</ConfirmButton>
        </Footer>
    } else {
        return <></>;
    }
};

const mapStateToProps = state => ({
    people: getPeople(state),
    zoneInfo: getZoneInfo(state),
    idSelectForAlloc: getIdsSelectForAlloc(state),
    selectZone: getSelectZone(state),
    selectRow: getSelectRow(state),
});

const mapDispatchToProps = dispatch => ({
    onChooseSeat: (zone, row) => dispatch(createChooseSeat(zone, row)),
    onDoneAlloc: () => dispatch(createDoneAlloc()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SeatMap);
