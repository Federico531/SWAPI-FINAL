({
    // Load expenses from Salesforce
    doInit: function(component, event, helper) {
        // Create the action
        // c.getAccounts va directo a SwapiController.apxc
        let action = component.get("c.getContacts");
        // Add callback behavior for when response is received
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.contacts", response.getReturnValue());
                
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        // Send action off to be executed
        $A.enqueueAction(action);
    },
    
    handleUpdateContact: function(component, event, helper) {
        let updatedExp = event.getParam("contact");
        helper.updateContact(component, updatedExp);
    },
    handleCreateContact: function(component, event, helper) {
        let newContact = event.getParam("contact");
        helper.createContact(component, newContact);
        alert("Contacto guardado")
    },
    buscar : function(component, event, helper) {      
        
        // Verifico si obtengo bien el valor desde el campo		       
        var valorABuscar = component.find('expenseformID').get('v.value'); //Obtengo el valor (ID) a buscar en la API
        
        //**** PRUEBA 
        
        //**** FIN PRUEBA
        
        //validacion para que trainga solo personajes que existan desde la API
        if(valorABuscar >= 1 && valorABuscar <89){ // INICIO DEL IF GENERAL DE VALIDACION DE ID        
        
        var dato = 'people';

        // Hago la llamada al metodo del controlador APEX (ContactController)
        var action = component.get("c.llamarALaApi");
        
        action.setParams({
            "valorABuscar": valorABuscar,
            "dato": dato
        });
                
        // Agregar comportamiento de la callback para cuando se recibe la respuesta
        action.setCallback(this, function(response) {
            
        var state = response.getState();
            
        if (state === "SUCCESS") {
            // Habilito el boton guardar, ya que se hizo la llamada a la API
            let button = component.find('saveButton');
            button.set('v.disabled', false);                  
           
            var respuesta = response.getReturnValue();
            helper.insertData(component, valorABuscar, respuesta);
        }
        else {
            console.log("Falló con el estado: " + state);
        }                    
        });
        // Enviar acción para ejecutar
        $A.enqueueAction(action);
        
        } // FIN DEL IF GENERAL DE VALIDACION DE ID VALIDO
	}
})
