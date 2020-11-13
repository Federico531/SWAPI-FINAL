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
            // Crear nuevo contacto
            let newContact = component.get("v.newContact");
            console.log("Create Character: " + JSON.stringify(newContact));
            helper.createContact(component, newContact);
        }
    },
    buscar : function(component, event, helper) {      
        
        
        // Obtengo el valor (ID) a buscar en la API      
        var valorABuscar = component.find('expenseformID').get('v.value'); 
        
        //validacion para que traiga solo personajes que existan desde la API
        
        // Valida el ID ingresado
        var tst = $A.get("e.force:showToast");
        tst.setParams({
            'title' : 'ERROR',
            'message' : 'Ingrese un valor Entre 1 y 88',
            'type' : 'error',
            'duration' : 8000,
            'mode' : 'dismissible'
        });
        if(valorABuscar >= 1 && valorABuscar <89){       
            
            var dato = 'people';
            
            // Hago la llamada al metodo del controlador APEX (SwapiController)
            var action = component.get("c.llamarALaApi");
            
            action.setParams({
                "valorABuscar": valorABuscar,
                "dato": dato
            });
            
            // Esto genera una respuesta asíncrona mientras espera la respuesta de la API
            action.setCallback(this, function(response) {
                
                var state = response.getState();
                
                if (state === "SUCCESS") {
                    
                    // Habilito el boton guardar luego de recibir los datos de la API
                    let button = component.find('saveButton');
                    button.set('v.disabled', false);                  
                    
                    var respuesta = response.getReturnValue();
                    helper.insertData(component, valorABuscar, respuesta);
                }
                else {
                    console.log("Falló con el estado: " + state);
                }                    
            });
            // Enviar acción para ejecutarse
            $A.enqueueAction(action);
            
        }else{
            tst.fire();
        } 
    }
})
