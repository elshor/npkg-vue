# npkg-vue3
This Natura package enables building web apps using vue3

This page documents the usage of the `setup` component option. If you are using Composition API with Single-File Components, [`<script setup>`](/api/sfc-script-setup.html) is recommended for a more succinct and ergonomic syntax.

## Plugins
The following is a list of plugins that can be integrated into this package:
* `initMountedVue(VueOptions)` - called after options are generated but before application is mounted
* `appMounted(app)` - called after the app is mounted
* `beforeAppMount(app)` - called before the app is mounted

## Routing
Each page may have a property named `subPages`. The router generator creates the routing hierarchy by generating a page component for each subPage and adding it to the router hierarchy. It uses name or ref for router name. The path is the specified path property or, if doesn't exist, the name property.