import os
import sys

def CheckIndexExistence(index_path):
    """
    Check to see if the index file exists, if it does remove it
    so that we can generate a new one
    """
    index_exists = os.path.exists(index_path)
    if index_exists:
        os.remove(index_path)

def GrabFolders(path):
    """
    Helper function that grabs all of the folders in a given path
    """
    dirs = [os.path.join(path, d) for d in os.listdir(path=path) if os.path.isdir(os.path.join(path, d))]
    return dirs

def GrabFiles(path):
    """
    Helper function that grabs all of the files in a given path
    """
    files = [os.path.join(path, f) for f in os.listdir(path=path) if os.path.isfile(os.path.join(path, f))]
    return files

def FindRoutes(path):
    """
    Finds all of the routes needed for index json and returns
    them in a list
    """
    routes = []
    dirs = GrabFolders(path)
    while dirs:
        current_dir = dirs[0]
        files = GrabFiles(current_dir)
        if files:
            routes.extend(files)
        
        # update directory list
        sub_dirs = GrabFolders(current_dir)
        dirs.extend(sub_dirs)
        dirs.remove(current_dir)
        if len(dirs) > 8:
            break
    return routes

def CreateIndexFile(path, routes):
    """
    Given a list of routes, creates the index.json file
    """
    save_path = os.path.join(path, "index.json")
    f = open(save_path, "w")
    f.write("{\n")
    f.write("\t\"pages\": [\n")
    START_OF_ROUTE_INDEX = 31
    for i, route in enumerate(routes):
        route = route[START_OF_ROUTE_INDEX:]
        if i == (len(routes) - 1):
            f.write(f"\t\t\"{route}\"\n")
        else:
            f.write(f"\t\t\"{route}\",\n")
    f.write("\t]\n")
    f.write("}")
    f.close()

if True:
    # grab path from bash script
    path = sys.argv[1]
    
    # remove previous index version
    CheckIndexExistence(os.path.join(path, "index.json"))

    # get all routes
    routes = FindRoutes(path)

    # create index json file
    CreateIndexFile(path, routes)
        
