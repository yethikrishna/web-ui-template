{-# LANGUAGE OverloadedStrings #-}

-- |
-- Module      : Main
-- Description : create-varsha Haskell wrapper
-- Copyright   : (c) 2026 Yethikrishna R
-- License     : MIT
--
-- A Haskell wrapper for the create-varsha CLI tool.
-- Scaffolds a new varsha website project by delegating to the
-- Node.js-based create-varsha package.
module Main (main) where

import Control.Monad (when, unless)
import Data.List (isPrefixOf, intercalate)
import System.Directory (doesDirectoryExist, doesFileExist,
                         getCurrentDirectory, setCurrentDirectory,
                         removeDirectoryRecursive)
import System.Environment (getArgs, lookupEnv)
import System.Exit (exitWith, ExitCode (..))
import System.FilePath ((</>))
import System.IO (hFlush, stdout, hSetEncoding, utf8)
import System.Process (callCommand, readProcessWithExitCode)

-- | Package version
version :: String
version = "1.0.0"

-- | Repository URL
repoUrl :: String
repoUrl = "https://github.com/yethikrishna/web-ui-template"

-- | Main entry point
main :: IO ()
main = do
  hSetEncoding stdout utf8
  args <- getArgs

  -- Handle help and version flags
  when ("--help" `elem` args || "-h" `elem` args) $ do
    showHelp
    exitWith ExitSuccess
  when ("--version" `elem` args || "-v" `elem` args) $ do
    putStrLn $ "create-varsha v" ++ version
    exitWith ExitSuccess

  -- Print banner
  printBanner

  -- Check for Node.js
  hasNode <- checkCommand "node"
  unless hasNode $ do
    putStrLn "\x1b[31m[Error] Node.js is required but not found.\x1b[0m"
    putStrLn "Please install Node.js (>= 18.17.0) from https://nodejs.org"
    exitWith (ExitFailure 1)

  -- Determine project name
  let projectName = case filter (not . isPrefixOf "--") args of
        (name : _) -> name
        [] -> "my-varsha-site"

  -- Validate project name
  validateProjectName projectName

  -- Check if directory exists
  currentDir <- getCurrentDirectory
  let targetDir = currentDir </> projectName
  dirExists <- doesDirectoryExist targetDir
  when dirExists $ do
    putStrLn $ "\x1b[31m[Error] Directory '" ++ projectName ++ "' already exists.\x1b[0m"
    exitWith (ExitFailure 1)

  -- Check for npx
  hasNpx <- checkCommand "npx"
  unless hasNpx $ do
    putStrLn "\x1b[31m[Error] npx is required but not found.\x1b[0m"
    putStrLn "Please ensure npm is installed with Node.js."
    exitWith (ExitFailure 1)

  -- Run create-varsha via npx
  putStrLn $ "\x1b[36m[Info]\x1b[0m Scaffolding project in \x1b[1m" ++ projectName ++ "\x1b[0m..."
  let cmd = "npx create-varsha " ++ projectName ++ " --no-install"
  ec <- callCommandResult cmd
  case ec of
    ExitSuccess -> do
      putStrLn $ "\x1b[32m[Success]\x1b[0m Project created at \x1b[1m" ++ targetDir ++ "\x1b[0m"

      -- Check if npm is available for dependency installation
      hasNpm <- checkCommand "npm"
      when hasNpm $ do
        putStrLn "\x1b[36m[Info]\x1b[0m Installing dependencies..."
        setCurrentDirectory targetDir
        _ <- callCommandResult "npm install"
        setCurrentDirectory currentDir
        putStrLn "\x1b[32m[Success]\x1b[0m Dependencies installed."

      putStrLn ""
      putStrLn "\x1b[1mNext steps:\x1b[0m"
      putStrLn $ "  cd " ++ projectName
      putStrLn "  npm run dev"
      putStrLn ""
      putStrLn "\x1b[2mHappy building! Your varsha site will be at http://localhost:4321\x1b[0m"
    _ -> do
      putStrLn "\x1b[31m[Error] Failed to scaffold project.\x1b[0m"
      exitWith (ExitFailure 1)

-- | Validate the project name
validateProjectName :: String -> IO ()
validateProjectName name
  | null name = do
      putStrLn "\x1b[31m[Error] Project name cannot be empty.\x1b[0m"
      exitWith (ExitFailure 1)
  | head name == '.' = do
      putStrLn "\x1b[31m[Error] Project name cannot start with a dot.\x1b[0m"
      exitWith (ExitFailure 1)
  | otherwise = return ()

-- | Check if a command exists on the system
checkCommand :: String -> IO Bool
checkCommand cmd = do
  (ec, _, _) <- readProcessWithExitCode "where" [cmd] ""
  case ec of
    ExitSuccess -> return True
    _ -> do
      (ec2, _, _) <- readProcessWithExitCode "which" [cmd] ""
      return $ ec2 == ExitSuccess

-- | Run a command and return its exit code
callCommandResult :: String -> IO ExitCode
callCommandResult cmd = do
  (ec, _, _) <- readProcessWithExitCode "cmd" ["/c", cmd] ""
  return ec

-- | Print the banner
printBanner :: IO ()
printBanner = do
  putStrLn "\x1b[36m"
  putStrLn "  ██╗   ██╗ █████╗ ██████╗ ███████╗██╗   ██╗ █████╗ ██████╗  ██████╗██╗  ██╗"
  putStrLn "  ██║   ██║██╔══██╗██╔══██╗██╔════╝██║   ██║██╔══██╗██╔══██╗██╔════╝██║  ██║"
  putStrLn "  ██║   ██║███████║██████╔╝███████╗██║   ██║███████║██████╔╝██║     ███████║"
  putStrLn "  ╚██╗ ██╔╝██╔══██║██╔══██╗╚════██║██║   ██║██╔══██║██╔══██╗██║     ██╔══██║"
  putStrLn "   ╚████╔╝ ██║  ██║██║  ██║███████║╚██████╔╝██║  ██║██║  ██║╚██████╗██║  ██║"
  putStrLn "    ╚═══╝  ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝"
  putStrLn "\x1b[0m"
  putStrLn "  A premium Astro + Starlight starter template by myndlabs"
  putStrLn ""

-- | Show help information
showHelp :: IO ()
showHelp = do
  putStrLn "create-varsha — Scaffold a new varsha website project"
  putStrLn ""
  putStrLn "Usage: create-varsha [project-name] [options]"
  putStrLn ""
  putStrLn "Arguments:"
  putStrLn "  project-name    Name of the project directory to create"
  putStrLn ""
  putStrLn "Options:"
  putStrLn "  -h, --help      Show this help message"
  putStrLn "  -v, --version   Show version information"
  putStrLn ""
  putStrLn "Description:"
  putStrLn "  This is a Haskell wrapper for the create-varsha CLI."
  putStrLn "  It requires Node.js (>= 18.17.0) and npm to be installed."
  putStrLn "  The wrapper delegates to npx create-varsha for project scaffolding."
  putStrLn ""
  putStrLn "Prerequisites:"
  putStrLn "  - Node.js >= 18.17.0 (https://nodejs.org)"
  putStrLn "  - npm (comes with Node.js)"
  putStrLn ""
  putStrLn "Examples:"
  putStrLn "  create-varsha my-site        Create a new project named 'my-site'"
  putStrLn "  create-varsha my-blog         Create a new blog project"
  putStrLn ""
  putStrLn "Repository:"
  putStrLn "  https://github.com/yethikrishna/web-ui-template"
  putStrLn ""
  putStrLn "License: MIT"
