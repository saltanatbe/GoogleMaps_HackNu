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
        <p class="text-left">Name: {{formValues.name}}</p>
        <p class="text-left">Floor label: {{formValues.floor}}</p>
        <p class="text-left">Activity: {{formValues.activity}}</p>
        <p class="text-left"></p>
        <p class="text-left">{{formValues.Latitude}}, {{formValues.Longitude}}, {{formValues.Altitude}}</p>
      </div>
    </template>
    
    <style scoped>
    .meta-data{    
        position: fixed;
        top: 135px;
        right: 10px; 
        width: 100px;
        box-sizing: border-box; 
        padding: 5px;
        border: solid 2px white;
        border-radius: 6px;
        background:  rgba(255,255,255,0.7); /* Green background with 30% opacity */

    }
    </style>
    