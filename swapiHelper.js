({
    //VERSION REDUCIDA
    saveContact: function(component, contact, callback) {
        let action = component.get("c.saveContact");
        action.setParams({
            "contact": contact
        });
        if (callback) {
            action.setCallback(this, callback);
        }
        $A.enqueueAction(action);
    },
    createContact: function(component, contact) {
        this.saveContact(component, contact, function(response){
            let state = response.getState();
            if (state === "SUCCESS") {
                let contacts = component.get("v.contacts");
                contacts.push(response.getReturnValue());
                component.set("v.contacts", contacts);
            }
        });
        
    },
    updateContact: function(component, contact) {
        this.saveContact(component, contact);
    },

})
