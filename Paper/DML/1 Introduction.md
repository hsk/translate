- [Abstract](0 Abstract.md)

# 1 Introduction

[](In this paper, we report some research on supporting the use of dependent types in practical programming, drawing most of the results from (Xi, 1998).
We do not attempt to incorporate into this paper some recent, closely related results (e.g., guarded recursive datatypes (Xi et al., 2003), Applied Type System (Xi, 2004)), with which we only provide certain comparison.
)
本論文では、実用的なプログラミングで依存型の使用をサポートした（Xi, 1998）からの結果を最大限に生かした上でいくつかの研究を報告している。
我々はこの論文にいくつかの最近の、密接に関連した結果(例えば、ガードされた再帰的なデータ型(Xi et al., 2003)、Applied Type System (Xi, 2004))を組み込まない。

----

[](
Type systems for functional languages can be broadly classified into those for rich, realistic programming languages such as Standard ML (Milner et al., 1997), Objective Caml (INRIA, n.d.), or Haskell (Peyton Jones et al. , 1999), and those for small, pure languages such as the ones underlying Coq (Dowek et al., 1993), NuPrl (Constable et al. , 1986), or PX (Hayashi & Nakano, 1988).
In practical programming, type-checking should be theoretically decidable as well as practically feasible for typical programs without requiring an overwhelmingly large number of type annotations.)

関数型言語の型システムはStandard ML（Milnerら, 1997）、Objective Caml (INRIA, n.d.)
、またはHaskell（Peyton Jones ら、1999）などの広い意味で高級で現実的なプログラミング言語のためのものと、小さくて純粋な言語Coq（Dowekら、1993）、NuPrl（Constableら、1986）、またはPX（林·中野、1988）のようなものが根底にあるものに分類することができます。
実用的なプログラミングでは、型チェックは、理論的には型注釈の大部分を必要とすることなく、典型的なプログラムのための実用的に実行可能なだけでなく、決定可能であるべきである。
[](
In order to achieve this, the type systems for realistic programming languages are often relatively simple, and only relatively elementary properties　of programs can be expressed and thus checked by a type-checker.
For instance, the error of taking the first element out of an empty list cannot be prevented by the type system of ML since it does not distinguish an empty list from a non-empty one.)
これを達成するために、現実的なプログラミング言語の型システムは、多くの場合、型チェッカによって確認されているので比較的簡単に、プログラムだけの比較的基本の特性を発現させることができる。
例えば、空のリストから最初の要素を取得するエラーは空でないリストと空のリストを区別していないので、MLの型システムによって防止することができない。
[](
Richer type theories such as the Calculus of Inductive Constructions (underlying Coq) or Martin-L¨of type theories (underlying NuPrl) allow full specifications to be formulated, which means that type-checking becomes undecidable or requires excessively verbose type annotations.
It also constrains the underlying functional language to remain relatively pure, so that it is possible to effectively reason about program properties within a type theory.
)
（Coqの基礎をなす）帰納的構造の計算法または（NuPrlの基礎をなす）マーティン-L型理論など豊かな型理論は、完全な仕様が策定されることを可能にし、これは型チェックが決定不能になったり、過度に冗長な型注釈が必要なことを意味する。
また、効果的に型理論内のプログラムのプロパティについて推論することが可能となるように、基礎となる関数型言語では、比較的純粋なままに制約する。

	datatype ’a list (int) =
	    nil(0) | {n:nat} cons(n+1) of ’a * ’a list(n)

	fun(’a)
	    append (nil, ys) = ys
	  | append (cons (x, xs), ys) = cons (x, append (xs, ys))
	withtype {m:nat,n:nat} ’a list(m) * ’a list(n) -> ’a list(m+n)

[](Fig. 1. An introductory example: appending lists)
図 1. 導入例: リストへの追加

----

[](Some progress has been made towards bridging this gap, for example, by extracting Caml programs from Coq proofs, by synthesizing proof skeletons from Caml programs (Parent, 1995), or by embedding fragments of ML into NuPrl (Kreitz et al., 1998).
In this paper, we address the issue by designing a type system for practical programming that supports a restricted form of dependent types, allowing more program invariants to be captured by types.
)
いくつかの進展は、このギャップを埋めることに向けてなされたもので、例えば、Coqの証明からCamlのプログラムを抽出する、 Camlのプログラム（Parent、1995）から証明骨格を合成する、またはNuPrlにMLのフラグメントを埋め込む（Kreitzら、1998）ことによって行われている。
本論文で、我々は、複数のプログラム不変条件はタイプによって捕獲されることを可能にする、依存型の制限された形式をサポートしている実用的なプログラミングのための型システムを設計することで問題に対処する。
[](
We conservatively extend the type system of ML by allowing some dependencies while maintaining practical and unintrusive type-checking.
It will be shown that a program that is typable in the extended type system is already typable in ML.
)
我々は、実用的である事とunintrusive型チェックを維持しながら、いくつかの依存関係を可能にすることにより、MLの型システムを保守的に拡張する。
これは、拡張型システムで型付けされたプログラムは、MLで既に型付け可能であることが示される。
[](
However, the program may be assigned a more precise type in the extended type system than in ML.
It is in this sense we refer to the extended type system as a conservative extension of ML.
)
しかし、プログラムは、MLよりも拡張型システムにおいて、より正確な型を割り当てることができる。
それは我々がMLの保守的な拡張として拡張型システムを参照するという意味である。

----
[](
We now present a short example from our implementation before going into further details.
A correct implementation of the append function on lists should return a list of length m + n when given two lists of length m and n, respectively.
This property, however, cannot be captured by the type system of ML, and the inadequacy can be remedied if we introduce a restricted form of dependent types.
)
我々は、ここでさらに詳細に入る前に、我々の実装から短い例を提示する。
リストに追加する関数の正しい実装はそれぞれ長さmとnの2つのリストを与えられた時長さm+nのリストを返す必要があります。
このプロパティは、MLの型システムによってキャプチャできないが、しかし、我々が依存型の制限された形を導入した場合に不備を改善することができます。

----
[](
The code in Figure 1 is written in the style of ML with a type annotation.
The declared type constructor list takes a type τ and a type index n (of sort int) to form a type (τ )list(n) for lists of length n in which each element is of type τ .
The value constructors associated with list are then assigned certain dependent types:
)
図1のコードは、型注釈を持つMLのスタイルで書かれている。
宣言された型コンストラクタリストは、型τと(種intの)型インデックスnを取りtype(τ)list(n)の形式で各要素が型τで長さnのリストです。
リストに関連付けられた値コンストラクタは、その後、特定の依存型が割り当てられています:

[](- The syntax nil(0) states that the list constructor nil is assigned the type ∀α.(α)list(0), that is, nil is a list of length 0.)
[](- The syntax `{n:nat} cons(n+1)` of `’a * ’a list(n)` states that the list constructor cons is assigned the following type,)

- 構文nil(0)の状態はリストのコンストラクタはnilが型`∀α.(α)list(0)`が割り当てられていること、つまり、nilは長さ0のリストである。
- `’a * ’a list(n)` の`{n:nat} cons(n+1)` 構文は、リストのコンストラクタconsは次のタイプが割り当てられており、

		∀α.Πn:nat. α ∗ (α)list(n) → (α)list(n + 1)

	[](that is, cons yields a list of length n + 1 when given a pair consisting of an element and a list of length n.
	We use nat for a subset sort defined as `{a : int | a ≥ 0}` and the syntax `{n:nat}` for a universal quantifier over type index variable n of the subset sort nat.)

	すなわち、要素と、長さnのリストのペアが与えられたときにconsは長さn+1のリストを与える。
	我々は、ソートnat部分集合のタイプインデックス変数n以上の普遍数量詞のために、ソート`{a : int | a ≥ 0}`と`{n:nat}`構文として定義された部分集合にnatを使用します。


[](The withtype clause in the definition of the function append is a type annotation, which precisely states that append returns a list of length m + n when given a pair of lists of length m and n, respectively.
The annotated type can be formally written)

関数appendの定義でwithtype句は型注釈で、正確にそのそれぞれの長さmとnのリストの対が与えられたときに長さm + nのリストを足し合わせて返す。
注釈付きの型は、形式的に記述することができ、

	fun (’a)
	    filter p [] = []
	  | filter p (x :: xs) = if p (x) then x :: filter p xs else filter p xs
	withtype {m:nat} ’a list (m) -> [n:nat | n <= m] ’a list (n)

[](Fig. 2. Another introductory example: filtering lists)
図 2. もう一つの導入例：フィルタリングリスト

[](as follows:)

次のように：


	∀α.Πm:nat.Πn:nat. (α)list(m) ∗ (α)list(n) → (α)list(m + n)

[](which we often call a universal dependent type.
In general, the programmer is responsible for assigning dependent types to value constructors associated with a declared datatype constructor;
he or she is also responsible for providing type annotations against which programs are automatically checked.)

我々はしばしばユニバーサル依存型を呼び出します。
一般的には、プログラマが宣言したデータ型のコンストラクタに関連付けられている値のコンストラクタに依存型を割り当てる責任がある。
彼または彼女はまた、プログラムが自動的にチェックされ、それに対して型注釈を提供する責任があります。

----

[](Adding dependent types to ML raises a number of theoretical and pragmatic questions.
In particular, the kind of pure type inference in ML, which is certainly desirable in practice, becomes untenable, and a large portion of the paper is devoted to addressing various issues involved in supporting a form of partial type inference.
We briefly summarize our results and design choices as follows.)

MLへの依存型を追加は、理論的、実践的な問題がいくつか起きる。
具体的には、実際には確かに望ましいMLで純粋な型推論の種類は、支持できないなり、論文の大部分は、部分的な型推論の形式をサポートしているに関与する様々な問題に対処するに専念しています。
次のように我々は簡潔に我々の結果と設計上の選択をまとめる。

----

[](The first question that arises is the meaning of expressions with effects when they occur as type index terms.
In order to avoid the difficulty, we require that type index terms be pure.
In fact, our type system is parameterized over a pure type index language from which type index terms are drawn.
We can maintain this purity and still make the connection to run-time values by using singleton types, such as int(n), which is the type for integer expressions of value equal to n.
This is critical for practical applications such as static elimination of array bound checks (Xi & Pfenning, 1998).)

最初の問題は、彼らは型インデックス項として発生したときに、その発生したが効果を持つ式の意味である。
困難を回避するために、我々はその型インデックス項が純粋であることが必要です。
実際には、我々の型システムは、型インデックス項が書かれるから純粋な型インデックス言語上でパラメータ化されている。
我々は、この純度を維持し、まだそのnに等しい値の整数式の型であるint(n)などのシングルトン型を、使用して値を実行時の接続を行うことができます。
これは、このような配列境界チェック(Xi & Pfenning, 1998)の静的除去などの実用的なアプリケーションのために重要である。

----

[](The second question is the decidability and practicality of type-checking.
We address this in two steps: the first step is to define an explicitly typed (and unacceptably verbose) language for which type-checking is easily reduced to constraint satisfaction in some type index language L.
The second step is to define an elaboration from DML(L), a slightly extended fragment of ML, to the fully explicitly typed language which preserves the standard operational semantics.
The correctness of elaboration and decidability of type-checking modulo constraint satisfiability constitute the main technical contribution of this paper.)

第二の問題は、決定可能性と型チェックの実用性である。
我々は2つのステップでこれに対処する：最初のステップは、型チェックが簡単にいくつかの型インデックス言語Lに満足度を制約に還元されるために明示的に入力する（受け入れ難いほど冗長な）言語を定義することです
第二段階は、標準的な操作的意味論を維持し、完全に明示的に型付けされた言語に、DML（L）、MLをわずかに拡張した断片から推敲を定義することです。
精緻化と型チェックモジュロ制約充足の決定可能性の正しさは、この論文の主な技術的貢献を構成している。

----

[](
The third question is the interface between dependently annotated and other parts of a program or a library.
Our experience clearly shows that existential dependent types, which are involved in nearly all the realistic examples in our experiments, are indispensable in practice.
For this we use existential dependent types, although they introduce non-trivial technical complications into the elaboration procedure.)

第三の問題は、プログラムやライブラリの依存注釈付きの他の部分との間のインターフェースである。
彼らは推敲手続きに非自明な技術的な複雑化を引き起こしますが、このために我々は、existential(実存)依存型を使用します。
我々の経験は、明らかに、我々の実験ではほぼすべての現実的な実施例に関係しているexistential(実存)依存型は、実際には不可欠であることを示している。

	∀α.Πm:nat. (α)list(m) → Σn:{a : nat | a ≤ m}. (α)list(n)

[](
where {a : nat | a ≤ m} is a sort for natural numbers that are less than or equal to m.
The type `Σn:{a : nat | a ≤ m}. (α)list(n)`, which is for lists of length less than or equal to m, is what we call an existential dependent type.
The type assigned to filter simply means that the output list returned by filter cannot be longer than the input list taken by filter.
Without existential dependent types, in order to assign a type to filter, we may have to compute in the type system the exact length of the output list returned by filter in terms of the input list and the predicate taken by filter.
This would most likely make the type system too complicated for practical programming.
For instance, the function filter defined in Figure 2 is assigned the following types:
)

ここで、{a : nat | a ≤ m} はm以下の自然数のソートです。
m以下か等しい長さのリストである型`Σn:{a : nat | a ≤ m}. (α)list(n)`は、我々がexistential(実存)依存型と呼んでいるものです。
単にフィルタリングするために割り当てられたタイプは、フィルタによって返された出力リストがフィルターを通した入力リストよりも長くすることはできないことを意味します。
existential(実存)依存型がなければ、フィルタに型を割り当てるために、我々は型システムに入力リストとフィルタを通した述語の面でフィルタによって返された出力リストの正確な長さを計算する必要があります。
これはほとんどの場合実用的なプログラミングのための型システムが複雑になるだろう。
例えば、図2で定義された関数フィルタは、次の型が割り当てられます。

----

[](
We have so far finished developing a theoretical foundation for combining dependent types with all the major features in the core of ML, including datatype declarations, higher-order functions, general recursion, polymorphism, mutable references and exceptions.
We have also implemented our design for a fragment of ML that encompasses all these features.
In addition, we have experimented with different constraint domains and applications.
Many non-trivial examples can be found in (Xi, 1999).
At this point, we suggest that the reader first take a look at the examples in Section 7 so as to obtain a sense as to what can be effectively done in DML.
)

我々はこれまでに、データ型の宣言、高階関数、一般的な再帰、多相型、変更可能な参照や例外を含むMLのコア内のすべての主要な機能を持つ依存型を組み合わせるための理論的基礎の開発を完了した。
また、これらすべての機能を包含し、MLの断片のために我々のデザインを実装しました。
加えて、我々は別の制約ドメインおよびアプリケーションで実験してきた。
多くの非自明な例は(Xi、1999)に記載されています。
この時点で、我々は、読者が最初にそう効果的にDMLで行うことができるものにとして意味が得られるように7章の例を見てみてください。

----

[](
In our experience, DML(L) is acceptable from the pragmatic point of view: programs can often be annotated with little internal change and type annotations are usually concise and to the point.
The resulting constraint simplification problems can be solved efficiently in practice once the type index language L is properly chosen.
Also the type annotations are mechanically verified, and therefore can be fully trusted as program documentation.
)

我々の経験では、DML（L）は、ビューの実際的な観点から許容さ：プログラムは、多くの場合、簡潔な通常少し内部変更と種類の注釈としている注釈を付け、ポイントにすることができます。
型インデックス言語Lが適切に選択された後、得られた制約の簡略化の問題は、実際に効率的に解くことができる。
また、型注釈は、機械的に検証されているため、完全にプログラムドキュメントとして信頼することができます。

----

[](
The form of dependent types studied in this paper is substantially different from the usual form of dependent types in Martin-L¨of’s development of constructive type theory (Martin-L¨of, 1984; Martin-L¨of, 1985).
In some earlier research work (Xi, 1998; Xi & Pfenning, 1999) on which this paper is largely based, the dependent types studied in this paper are called a restricted form of dependent types.
From now on, we may also use the name DML-style dependent types to refer to such a restricted form of dependent types.
)

本論文で研究した依存型の形式は、建設的な型理論のマーティン-LOFが開発した依存型の通常の形と実質的に異なる(Martin-L¨of, 1984; Martin-L¨of, 1985)。
いくつかの以前の研究作業では、この論文は、主に(Xi, 1998; Xi & Pfenning, 1999)に基づいており、本論文で検討する依存型は、依存型の限定された形と呼ばれている。
今から、我々はまた、依存型のような制限された形を参照するためにDMLスタイル依存型の名前を使用することができます。

----

[](
The remainder of the paper is organized as follows.
In Section 2, we present as a starting point a simply typed language λpat, which essentially extends the simply typed λ-calculus with recursion and general pattern matching.
We then formally describe in Section 3 how type index languages can be formed.
In particular, we explain how constraint relations can be properly defined in type index languages.
The core of the paper lies in Section 4, where a language λΠ,Σ pat is introduced that extends λpat with both universal and existential dependent types.
)

次のように論文の構成はされている。
2章では、我々は、単純に型付けされた言語として存在するλpatを出発点として、本質的に再帰と一般的なパターンマッチングと単純に型指定されたλ計算を拡張します。
我々は、その後正式に3章でタイプインデックス言語がどのように形成することができるかを説明します。
特に、我々は、制約関係が正しく型インデックス言語で定義することが可能な方法について説明します。
論文のコアは、universal(普遍的)かつexistential(実存)依存型の両方を持つλpat拡張言語λΠ,Σpatが導入された4章です。
[](
We also formally prove the subject reduction theorem and the progress theorem for λΠ,Σ pat , thus establishing the type soundness of λΠ,Σ pat .
In Section 5, we introduce an external language DML0 designed for the programmer to construct programs that can be elaborated into λΠ,Σ pat .
We present a set of elaboration rules and then justify these rules by proving that they preserve the dynamic semantics of programs.
In support of the practicality of λΠ,Σ pat , we extend λΠ,Σ pat in Section 6 with parametric polymorphism (as is supported in ML), exceptions and references.
)
我々はまた、正式にこのようにλΠ,Σpatのタイプの健全性を確立し、対象還元定理(subect reduction定理)とλΠ,ΣpatのProgress定理を証明する。
5章では、我々はλΠ,Σ pat に合成することができるプログラムを構築するために、プログラマのために設計された外部言語DML0をご紹介します。
我々は、推敲ルールのセットを提示し、その後、彼らはプログラムの動的なセマンティクスを維持することを証明することによって、これらの規則を正当化する。
λΠ, Σ patの実用性のサポートでは、我々は、λΠ,Σ patを6章で（MLでサポートされていたように）パラメトリック多相型、例外と参照で拡張します。
[](
Also, we present some interesting examples in Section 7 to give the reader a feel as to how dependent types can be used in practice to capture program invariants.
We mention some closely related work in Section 8 and then conclude.
)
また、我々は、プログラムの不変条件を捕捉するために、実際にどのように依存型を使用できるかの感じを読者に与えるために7章でいくつかの興味深い例を提示する。
我々は、8章でいくつかの関連研究に言及し結論を述べる。

- 次へ : [2 λpat: A starting point](2 λpat A starting point.md)
