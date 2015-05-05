#!/bin/bash
cd ~/.dotfiles
dotfiles=$(find . -maxdepth 1 -type f | grep "\.\/\." | grep -v swp)
cd ~
for dotfile in $dotfiles
do
   ln -s -f ~/.dotfiles/$dotfile ~/$dotfile
done
