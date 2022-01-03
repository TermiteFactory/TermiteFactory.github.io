import { connect } from 'react-redux';
import { Navbar, Button, Nav } from 'react-bootstrap';
import styled from 'styled-components'
import {
    getZoneInfo,
    getIdsSelectForAlloc,
} from './redux';

const Seat = styled.div`
    height: 30px;
    width: 30px;
    background-color: powderblue;
    margin-left: 5px;
    margin-right: 5px;
    display: inline-block;
`

const RowContainer = styled.div`
    position: relative;
`

const Footer = styled.div`
    position: sticky;
    bottom: 0;
    background-color: white;
`

const SeatMap = ({ zoneInfo, idSelectForAlloc }) => {
    if (idSelectForAlloc.length > 0) {
        return <Footer>
            <div>
                <Nav variant="tabs" defaultActiveKey="/home">
                    <Nav.Item>
                        <Nav.Link>Zone A</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link>Zone B</Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>
            <RowContainer>
                <Button className="btn-sm">Row 1</Button><Seat /><Seat></Seat>
            </RowContainer>
        </Footer>
    } else {
        return <></>;
    }
};

const mapStateToProps = state => ({
    zoneInfo: getZoneInfo(state),
    idSelectForAlloc: getIdsSelectForAlloc(state),
});

const mapDispatchToProps = dispatch => ({
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SeatMap);
