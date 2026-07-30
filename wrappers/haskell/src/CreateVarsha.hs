-- |
-- Module      : CreateVarsha
-- Description : Core library functions for the create-varsha Haskell wrapper.
-- Copyright   : (c) 2026 Yethikrishna R
-- License     : MIT
--
-- This module provides the core functionality for scaffolding
-- varsha website projects from Haskell applications.
module CreateVarsha
  ( scaffoldProject
  , checkNodeJS
  , validateName
  , version
  , repoUrl
  ) where

import Control.Monad (when, unless)
import System.Directory (doesDirectoryExist, doesFileExist,
                         getCurrentDirectory, setCurrentDirectory)
import System.Exit (ExitCode (..))
import System.FilePath ((</>))
import System.Process (readProcessWithExitCode, callCommand)

-- | Package version
version :: String
version = "1.0.0"

-- | Repository URL
repoUrl :: String
repoUrl = "https://github.com/yethikrishna/web-ui-template"

-- | Check if Node.js is installed and meets version requirements
checkNodeJS :: IO Bool
checkNodeJS = do
  (ec, _, _) <- readProcessWithExitCode "where" ["node"] ""
  case ec of
    ExitSuccess -> return True
    _ -> do
      (ec2, _, _) <- readProcessWithExitCode "which" ["node"] ""
      return $ ec2 == ExitSuccess

-- | Validate a project name
validateName :: String -> Either String ()
validateName name
  | null name = Left "Project name cannot be empty"
  | head name == '.' = Left "Project name cannot start with a dot"
  | ' ' `elem` name = Left "Project name cannot contain spaces"
  | otherwise = Right ()

-- | Scaffold a new varsha project
-- | This delegates to npx create-varsha for the actual scaffolding
scaffoldProject :: String -> IO (Either String ())
scaffoldProject projectName = do
  -- Validate name
  case validateName projectName of
    Left err -> return $ Left err
    Right _ -> do
      -- Check Node.js
      hasNode <- checkNodeJS
      unless hasNode $ return $ Left "Node.js is required but not found"

      -- Check if directory exists
      currentDir <- getCurrentDirectory
      let targetDir = currentDir </> projectName
      dirExists <- doesDirectoryExist targetDir
      when dirExists $ return $ Left ("Directory '" ++ projectName ++ "' already exists")

      -- Run npx create-varsha
      (ec, stdout, stderr) <- readProcessWithExitCode
        "npx" ["create-varsha", projectName, "--no-install"] ""
      case ec of
        ExitSuccess -> return $ Right ()
        _ -> return $ Left ("Failed to scaffold project: " ++ stderr)
