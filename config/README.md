# How to configure your custom Microsoft Teams application using SAP's Bridge Framework.

The Bridge Framework will dynamically generate your custom application based upon configurations specified in JSON files. The configuration for the backend portion of your application will require mapping business objects to their respective APIs and interfaces. The configuration for the frontend portion of your application will require specifying the layout and content for your user interface.

# Backend Configuration

The Bridge Framework provides developers with several different ways to access and integrate business objects from SAP systems.

## objectMappingConfig.json

This file maps specific interfaces and APIs to business objects you want to display in your application.

The file follows a nested structure:

```
{
    "SystemName": {

        "InterfaceName": {

            "BusinessObject": {

            },
            .
            .
            .
        },
        .
        .
        .
    },
    .
    .
    .
}
```

A **system** refers to an SAP product that contains the business object you are interested in displaying. Currently, S/4HANA Cloud and On Premise are the first supported systems.

An **interface** refers to an API between your app and the system you are interested in accessing. Currently, Integration Suite, SAP Graph, and Destinations are supported interfaces.

A **business object** refers to any object accessible through interfaces in an SAP system. Currently, many business objects in S/4HANA are supported. A specific example of a business object could be a Purchase Order or a Company.

## Integration Suite

## Graph

## Destinations

# Frontend Configuration

You have already defined which business objects you plan to use and how to access them in the backend configuration. Now, in the frontend configuration you are able to define the content and layout you want to display with regards to your business objects.

Your application will consist of a single Landing Page, one or more Table Pages, and one or more Object Pages. Each page has a slightly different structure, but components and conventions are shared between the pages.

## Landing Page

A Landing Page consists of one or more cards that link to Table Pages.

The file, landingPageConfig.json follows this format:

```
{
  "id": "landingPageConfig",
  "path": "/",
  "solutions": [
    {
      "key": 1,
      "header": "Your title",
      "description": "Your description",
      "path": "/:System/:Interface/:BusinessObject"
    },
    .
    .
    .
  ]
}
```

## Table Page

As it's name would suggest, a Table Page displays a table containing instances of a business object.

The file containing the page's configuration follows this format:

```
{
  "pageType": "Table",
  "title": "Your Title",
  "system": "SystemName",
  "interface": "InterfaceName",
  "businessObject": "BusinessObjectName",
  "components": [
    {
      "type": "Table",
      .
      .
      .
      ]
    }
  ]
}
```

## Object Page

The Object Page displays details about one particular instance of a business object. Details can be displayed using the Property Grid and Table Components.

The file containing the page's configuration follows this format:

```
{
  "pageType": "Object",
  "title": "Your Title",
  "system": "SystemName",
  "interface": "InterfaceName",
  "businessObject": "BusinessObjectName",
  "components": [
    {
      "type": "PropertyGrid",
      .
      .
      .
    },
    {
      "type": "Table",
      .
      .
      .
    }
  ]
}
```

## Components

Both Table and Object Pages make use of the Table component (although component layout and behavior differs slightly), while the Object Page adds another component called the Property Grid.

### Table Component

The Table Component has the following optional properties:

| Key         | Value                                 |
| ----------- | ------------------------------------- |
| title       | string, no title appears by default   |
| searchable  | boolean, default is false             |
| interactive | boolean, default is false             |
| maxItems    | integer greater than 0, default is 50 |

The component is configured as follows:

```
{
    "type": "Table",
    "system": "SystemName",
    "interface": "InterfaceName",
    "businessObject": "BusinessObjectName",
    .
    .
    .
    <OptionalProperties>
    .
    .
    .,
    "columns": [
        {
          "content": "Property Name",
          "key": "PropertyKey"
        },
        .
        .
        .
      ]
}
```

### Property Grid Component

The Property Grid Component consists of a grid of Object Property Components that have the following optional properties:

| Key      | Value                                  |
| -------- | -------------------------------------- |
| editable | boolean, default is false              |
| link     | object, no link is included by default |

The component is configured as follows:

```
{
    "type": "PropertyGrid",
    "properties": [
        {
          "content": "Property Name",
          "key": "PropertyKey"
        },
        .
        .
        .
      ]
}
```
