# Created by newuser for 5.1.1
export EDITOR=vim
export VISUAL=vim
autoload -Uz compinit promptinit
compinit
promptinit

autoload -Uz colors && colors


function exitstatus()
{
        local STATUS=$?
        # echo $STATUS
        if [[ $STATUS == 0 ]]; then
                echo "$STATUS"
        else
                echo "$STATUS"
        fi
}

PROMPT="%{$fg_bold[green]%}%n@home %{$fg_bold[blue]%}%1~ $ %{$reset_color%}"
#PROMPT="%{$fg[red]%}%n%{$reset_color%}@%{$fg[blue]%}home %{$fg_no_bold[yellow]%}%1~ %{$reset_color%}%# "
RPROMPT="[%{$fg_no_bold[yellow]%}%?%{$reset_color%}]"

local knownhosts 
knownhosts=( ${${${${(f)"$(<$HOME/.ssh/known_hosts)"}:#[0-9]*}%%\ *}%%,*} ) 
zstyle ':completion:*:(ssh|scp|sftp):*' hosts $knownhosts 

#allow tab completion in the middle of a word
setopt COMPLETE_IN_WORD


## never ever beep ever
setopt NO_BEEP

# The following lines were added by compinstall

zstyle ':completion:*' completer _expand _complete _ignored _match _prefix
zstyle ':completion:*' matcher-list ''
zstyle :compinstall filename '/home/dlangevi/.zshrc'

autoload -Uz compinit
compinit
# End of lines added by compinstall
# Lines configured by zsh-newuser-install
HISTFILE=~/.histfile
HISTSIZE=10000
SAVEHIST=10000
setopt autocd extendedglob notify
bindkey -e
# End of lines configured by zsh-newuser-install

alias ls='ls --color=auto'

# Source global definitions
if [[ -f /etc/zshrc ]]; then
  . /etc/zshrc
fi

