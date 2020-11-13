({
    createContact: function(component, newContact) {
        let createEvent = component.getEvent("createContact");
        createEvent.setParams({ "contact": newContact});
        
        var tst = $A.get("e.force:showToast");
        tst.setParams({
            'title' : 'Éxito',
            'message' : 'Contacto Guardado',
            'type' : 'success',
            'duration' : 8000,
            'mode' : 'dismissible'
        });
        
        if(newContact){
            tst.fire();
        }
        createEvent.fire();
    },
    insertData: function(component, valorABuscar, respuesta) {
        
        var id = valorABuscar;       
        var nombre = JSON.parse(respuesta).name;      
        var altura = JSON.parse(respuesta).height;
        var genero = JSON.parse(respuesta).gender;
        var colorCabello = JSON.parse(respuesta).hair_color;
        var colorOjos = JSON.parse(respuesta).eye_color;
        var url = JSON.parse(respuesta).url;
        var planeta = JSON.parse(respuesta).homeworld;
        
        let valores = [id, nombre, altura, genero, colorCabello, colorOjos, url];
        let nuevosValores = []
        
        // Itero por los valores que declaré en el form 
        // si alguno es "unknow" o "n/a" lo campos vacios se muestran vacios
        
        for(var i=0; i<valores.length; i++){
            console.log(valores[i]);
            if( valores[i] === "unknown" || valores[i] === "n/a" || valores[i] === "none"){
                
                valores[i] = "";               
                nuevosValores.push(valores[i]);
            } else {
                nuevosValores.push(valores[i]);                
            }
        }
        
        // Aca finalmente lleno cada campo con el valor que introduje al array, este vacio o completo
        
        component.set('v.newContact.Characternumber__c', nuevosValores[0]);
        component.set('v.newContact.Name', nuevosValores[1]);
        component.set('v.newContact.Height__c', nuevosValores[2]);         
        component.set('v.newContact.Gender__c', nuevosValores[3]);
        component.set('v.newContact.Haircolor__c', nuevosValores[4]);
        component.set('v.newContact.Eyecolor__c', nuevosValores[5]);
        component.set('v.newContact.URL__c', nuevosValores[6]);
        
        //************Obtener planeta*************
        
        // Corto el string para obtener numero de planeta       
        var valor = planeta.slice(29,-1);
        var dato = 'planets';
        
        var action = component.get("c.llamarALaApi");
        
        action.setParams({
            "valorABuscar": valor,
            "dato": dato
        });
        
        //Genero un callback para que la aplicación no se detenga mientras recibo los datos
        action.setCallback(this, function(response) {
            
            var state = response.getState();
            
            if (state === "SUCCESS") {
                var res = response.getReturnValue();
                var planet = JSON.parse(res).name;
                
                if(planet === "unknown"){
                    planet = "";
                }
                
                component.set('v.newContact.Homeworld__c', planet);                
                
                //Deshabilito los campos completos
                
                component.find("contactform").forEach(function(valor) {
                    if(valor.get("v.value") !== ""){
                        valor.set("v.disabled", true);
                    } else {           		
                        valor.set("v.disabled", false);
                    }
                });         
                
            }
            else {
                console.log("Falló con el estado planet: " + state);
            }
        });   
        
        // Enviar acción para ejecutar
        $A.enqueueAction(action); 
        
    }     
    
})
