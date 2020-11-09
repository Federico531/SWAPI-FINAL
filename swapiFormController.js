({
 clickCreate: function(component, event, helper) {

        //component.find('aura:id')
        let validContact = component.find('contactform').reduce(function (validSoFar, inputCmp) {
            // Displays error messages for invalid fields
            inputCmp.showHelpMessageIfInvalid();
            return validSoFar && inputCmp.get('v.validity').valid;
        }, true);
        // If we pass error checking, do some real work
        if(validContact){
            // Create the new contact
            let newContact = component.get("v.newContact");
            console.log("Create Character: " + JSON.stringify(newContact));
            helper.createContact(component, newContact);
        }
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
