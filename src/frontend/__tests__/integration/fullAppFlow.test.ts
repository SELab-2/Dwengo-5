import {render, fireEvent, waitFor} from '@testing-library/svelte'
import App from './src/App.svelte'

test('full app flow student', async () =>{
     /*
     This test will cover the full app flow for a student user. 
     The teacher will however sometimes make some part for the student like an assignment.
     */
    const {getByText, getByLabelText} = render(App)
    
    //TODO create a new user
    //TODO fill out login form
    //TODO change language
    //TODO navigate to different pages
    //TODO look trhough the catalog
    //TODO join a class
    //TODO get assignments 
        /*
        This will be done by having 2 sessions like this:
            const studentSession = render(App)
            const teacherSession = render(App)
        */
    //TODO do assignments
    //TODO ask question
    //TODO check out notifictaions 
    
})