import React, { useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import Overview from './Overview';
import Curriculum from './Curriculum';
import Instructor from './Instructor';
import Review from './Review';



const CoureseTab = ({ EventsDetails }) => {
  const [activeTab, setActiveTab] = useState('1');

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  }

  return (
    <div>
      <div className="wpo-course-details-tab">
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '1' })}
              onClick={() => { toggle('1'); }}
            >
              Overview
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '2' })}
              onClick={() => { toggle('2'); }}
            >

              Curriculum
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '3' })}
              onClick={() => { toggle('3'); }}
            >

              instructor
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '4' })}
              onClick={() => { toggle('4'); }}
            >

              reviews
            </NavLink>
          </NavItem>
        </Nav>
      </div>
      <div className="wpo-course-details-text">
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <Overview />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                <Curriculum />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="3">
            <Row>
              <Col sm="12">
                <Instructor />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="4">
            <Row>
              <Col sm="12">
                <Review />
              </Col>
            </Row>
          </TabPane>

        </TabContent>
      </div>
    </div>
  );
}

export default CoureseTab;