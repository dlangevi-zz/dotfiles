#
# .zshrc is sourced in interactive shells.
# It should contain commands to set up aliases,
# functions, options, key bindings, etc.
#

# Source global definitions
if [[ -f /etc/zshrc ]]; then
  . /etc/zshrc
fi

# Source Facebook definitions
if [[ -f /usr/facebook/ops/rc/master.zshrc ]]; then
  . /usr/facebook/ops/rc/master.zshrc
elif [[ -f /mnt/vol/engshare/admin/scripts/master.zshrc ]]; then
  . /mnt/vol/engshare/admin/scripts/master.zshrc
fi

export EDITOR=vim
export VISUAL=vim

alias vi=vim
autoload -Uz compinit promptinit
compinit
promptinit

autoload -Uz colors && colors


setopt prompt_subst


PROMPT="%{$fg_bold[red]%}dev: %{$fg_bold[green]%}%n@%m %{$fg_bold[blue]%}%1~ $ %{$reset_color%}"
RPROMPT="[%(?,%{$fg_bold[green]%},%{$fg_bold[red]%})%?%{$reset_color%}]"

# PATH="$HOME/bin $path"
# export to sub-processes (make it inherited by child processes)
# export PATH


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
bindkey -v
bindkey '^R' history-incremental-pattern-search-backward
bindkey '^P' up-line-or-history
bindkey '^N' down-line-or-history

# End of lines configured by zsh-newuser-install

