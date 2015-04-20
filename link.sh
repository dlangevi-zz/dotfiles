#!/bin/bash
cd ~/.dotfiles
dotfiles=$(find . -maxdepth 1 -type f | grep "\.\/\." | grep -v swp)

for dotfile in $dotfiles
do
   ln -s -f $dotfile ~/$dotfile
done
