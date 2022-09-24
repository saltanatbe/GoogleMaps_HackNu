    <script>
    export default {
        name: "Metadata",
        props: {
            formValues: {
                type: Object
            }
        }
    }
    </script>
    
    <template>
      <div id="meta-data" class="meta-data">
        <p class="text-left">Name: {{formValues.Identifier}}</p>
        <p class="text-left">Floor label: {{formValues["Floor label"]}}</p>
        <p class="text-left">Activity: {{formValues.Activity}}</p>
        <p class="text-left">Vertical accuracy: {{formValues["Vertical accuracy"]}}</p>
        <p class="text-left">Horizontal accuracy: {{formValues["Horizontal accuracy"]}}</p>
        <p class="text-left">Time Stamp: {{formValues.Timestamp}}</p>
        
        <p class="text-left">Latitude: {{formValues.Latitude}}</p>
        <p class="text-left">Longitude: {{formValues.Longitude}}</p>
        <p class="text-left">Altitude: {{formValues.Altitude}}</p>
      </div>
    </template>
    
    <style scoped>
    .meta-data{    
        position: fixed;
        top: 135px;
        right: 10px; 
        width: 250px;
        box-sizing: border-box; 
        padding: 5px;
        border: solid 2px white;
        border-radius: 6px;
        background:  rgba(255,255,255,0.9); /* Green background with 30% opacity */

    }
    </style>
    