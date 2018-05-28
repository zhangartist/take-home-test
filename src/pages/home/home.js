// dependencies
import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import _ from 'underscore';
import $ from 'jquery';
import { List, Avatar, Spin, Modal, Card, Button } from 'antd';
import Store from '../../store/store.js';
import Request from '../../utils/request.js';
import J from '../../utils/helper.js';
import './home.css';




// ------------------------- State ------------------------- //
const initialState = {
    ajaxInProcess: false,
    contacts: [],
    wordInSearchBar: '',
    currentViewContact: null,
    currentEditContact: null,
    isCreatingContact: false,
};



// ------------------------ Actions ------------------------ //
function setAjaxInProcess(is_in_process){
    Store.dispatch({ type: 'SET_AJAX_IN_PROCESS', data: is_in_process });
}

function setContacts(arr){
	Store.dispatch({ type: 'SET_CONTACTS', data: arr });
}

function setWordInSearchBar(word){
	Store.dispatch({ type: 'SET_WORD_IN_SEARCH_BAR', data: word });
}

function deleteContact(userId){
    Store.dispatch({ type: 'DELETE_CONTACT', data: { userId } });
}

function updateContact(contact){
    Store.dispatch({ type: 'UPDATE_CONTACT', data: contact });
}

function createContact(contact){
    Store.dispatch({ type: 'CREATE_CONTACT', data: contact });
}

function setCurrentViewContact(contact){
    Store.dispatch({ type: 'SET_CURRENT_VIEW_CONTACT', data: contact });
}

function setCurrentEditContact(contact){
    Store.dispatch({ type: 'SET_CURRENT_EDIT_CONTACT', data: contact });
}

function setIsCreatingContact(isCreating){
    Store.dispatch({ type: 'SET_IS_CREATING_CONTACT', data: isCreating });
}



// ------------------------ Reducers ------------------------ //
function homeReducer(state = initialState, action){
	switch (action.type) {
        case 'SET_AJAX_IN_PROCESS':
            return { ...state, ajaxInProcess: action.data };
		case 'SET_CONTACTS':
            return { ...state, contacts: action.data };
        case 'SET_WORD_IN_SEARCH_BAR':
            return { ...state, wordInSearchBar: action.data };
        case 'DELETE_CONTACT':
            return { ...state, contacts: _.reject(state.contacts, user => user.userId == action.data.userId) };
        case 'CREATE_CONTACT':
            return { ...state, contacts: [action.data].concat(state.contacts) };
        case 'UPDATE_CONTACT':
            let userIndex = _.findIndex(state.contacts, { userId: action.data.userId });
            state.contacts[userIndex] = { ...state.contacts[userIndex], ...action.data }
            return state;
        case 'SET_CURRENT_VIEW_CONTACT':
            return { ...state, currentViewContact: action.data };
        case 'SET_CURRENT_EDIT_CONTACT':
            return { ...state, currentEditContact: action.data };
        case 'SET_IS_CREATING_CONTACT':
            return { ...state, isCreatingContact: action.data };
        default:
            return state;
    }
};



class Home extends Component {

	constructor(props){
        super(props);
	}

    // when page loads
    async componentDidMount(){
        let contacts = await Request({ type: 'GET', url: '/contacts' });
        setContacts(contacts);
    }

    // click 'delete'
    async clickDelete(contact){
        let { success } = await Request({ type: 'DELETE', url: `/contact/${contact.userId}` });
        if (success) deleteContact(contact.userId);
    }

    // click 'more'
    async clickMore(contact){
        // ajax
        let user = await Request({ type: 'GET', url: `/contact/${contact.userId}` });
        // show modal
        setCurrentViewContact(user);
    }

    // modal to display detailed user info
    renderDetailedContactModal(){
        let { currentViewContact } = this.props;
        if (!currentViewContact) return null;
        return (
            <Modal
                title={currentViewContact.name}
                visible={!!currentViewContact}
                maskClosable={true}
                onCancel={() => setCurrentViewContact(null)}
                onOk={() => setCurrentViewContact(null)}
            >
                <Avatar style={{ marginBottom: 15 }} size="large" shape="square" src={currentViewContact.picture}/>
                <p>Name: {currentViewContact.name}</p>
                <p>Job: {currentViewContact.job}</p>
                <p>Title: {currentViewContact.title}</p>
                <p>Address: {currentViewContact.address}</p>
                <p>Phone numbers: {currentViewContact.phone_numbers.map(J.formatPhone).join(', ')}</p>
                <p>Email: {currentViewContact.email}</p>
            </Modal>
        )
    }

    // click 'edit'
    clickEdit(contact){
        // show modal
        setCurrentEditContact(contact);
    }

    // grab input from form
    grabFormInputs(formClass){
        let $modal = $(document).find(formClass);
        // grab inputs
        let payload = {
            name: $modal.find('.name').val2(),
            job: $modal.find('.job').val2(),
            title: $modal.find('.title').val2(),
            address: $modal.find('.address').val2(),
            phone_numbers: $modal.find('.phone_numbers').val2().replace(/s+/g, '').split(','),
            email: $modal.find('.email').val2(),
            picture: $modal.find('.picture').val2(),
        };
        // validate (ensure all inputs are entered)
        for (let key in payload){
            if (!payload[key]) {
                alert(`Please enter ${key}.`);
                return false;
            }
        }
        return payload;
    }

    // submit edited contact
    async submitEditedContact(contact){
        // grab inputs
        var payload = this.grabFormInputs('.editor');
        if (!payload) return;
        // submit
        let user = await Request({ type: 'POST', url: `/contact/${contact.userId}`, payload });
        updateContact(user);
        setCurrentEditContact(null); // close modal
    }

    // modal to edit selected user
    renderEditContactModal(){
        let { currentEditContact } = this.props;
        if (!currentEditContact) return null;
        return (
            <Modal
                wrapClassName='editor'
                title={currentEditContact.name}
                visible={!!currentEditContact}
                maskClosable={true}
                onCancel={() => setCurrentEditContact(null)}
                onOk={() => this.submitEditedContact(currentEditContact)}
            >
                <input className="name" defaultValue={currentEditContact.name} placeholder="Name"/>
                <input className="job" defaultValue={currentEditContact.job} placeholder="Job"/>
                <input className="title" defaultValue={currentEditContact.title} placeholder="Title"/>
                <input className="address" defaultValue={currentEditContact.address} placeholder="Address"/>
                <input className="phone_numbers" defaultValue={currentEditContact.phone_numbers.join(', ')} placeholder="Phone numbers (separated by comma)"/>
                <input className="email" defaultValue={currentEditContact.email} placeholder="E-mail"/>
                <input className="picture" defaultValue={currentEditContact.picture} placeholder="Picture URL"/>
            </Modal>
        )
    }

    // click 'Add Contact'
    clickAdd(){
        // show modal
        setIsCreatingContact(true);
    }

    // submit created contact
    async submitCreatedContact(contact){
        // grab inputs
        var payload = this.grabFormInputs('.creator');
        if (!payload) return;
        // submit
        let user = await Request({ type: 'PUT', url: `/contact`, payload });
        createContact(user);
        setIsCreatingContact(false); // close modal
    }

    // modal to create user
    renderCreateContactModal(){
        return (
            <Modal
                wrapClassName='creator'
                title='Create a contact'
                visible={this.props.isCreatingContact}
                maskClosable={true}
                onCancel={() => setIsCreatingContact(false)}
                onOk={() => this.submitCreatedContact()}
            >
                <input className="name" placeholder="Name"/>
                <input className="job" placeholder="Job"/>
                <input className="title" placeholder="Title"/>
                <input className="address" placeholder="Address"/>
                <input className="phone_numbers" placeholder="Phone numbers (separated by comma)"/>
                <input className="email" placeholder="E-mail"/>
                <input className="picture" placeholder="Picture URL"/>
            </Modal>
        )
    }

    // render add contact block
    renderAddContactBlock = () => (
        <div className='add-contact'>
            <Button type="primary" onClick={this.clickAdd}>+ Add Contact</Button>
        </div>
    )

    // render search bar
    renderSearch = () => (
        <input className='search' placeholder='Filter contacts by name...' onChange={e => setWordInSearchBar(e.target.value)}/>
    )

    // render list of contacts
    renderContactList(){
        let { wordInSearchBar } = this.props;
        let visibleContacts = _.filter(this.props.contacts, contact =>
            contact.name.toLowerCase().indexOf(wordInSearchBar.toLowerCase()) >= 0
        );
        return (
            <List itemLayout="horizontal" bordered dataSource={visibleContacts} renderItem={contact => (
                <List.Item actions={[
                    <span className='link red' onClick={e => this.clickDelete(contact)}>delete</span>,
                    <span className='link' onClick={e => this.clickEdit(contact)}>edit</span>,
                    <span className='link' onClick={e => this.clickMore(contact)}>more</span>
                ]}>
                    <List.Item.Meta
                        avatar={<Avatar size="large" src={contact.picture} />}
                        title={contact.name}
                        description={`${contact.title} • ${contact.email}`}
                    />
                </List.Item>
                )}
            />
        );
    }

    // main render
  	render(){
        let { contacts, ajaxInProcess } = this.props;
    	return (
            <Spin spinning={ajaxInProcess}>
                {/* above wraps entire screen with loader, whenever an ajax request is performed, loader is shown */}

        		<div className='home'>

                    <div className='contacts'>
                        {/* add contact button */}
                        {this.renderAddContactBlock()}

                        {/* search by name functionality */}
                        {this.renderSearch()}

                        {/* contact list */}
                        {this.renderContactList()}
                    </div>

                    {/* modal to display detailed user info */}
                    {this.renderDetailedContactModal()}

                    {/* modal to edit selected user */}
                    {this.renderEditContactModal()}

                    {/* modal to create user */}
                    {this.renderCreateContactModal()}

                </div>
            </Spin>
    	);
  	}
}




function mapStateToProps(state){
    return {
        ...state.home
    };
}

export default connect(mapStateToProps)(Home);
export { homeReducer, setAjaxInProcess };
